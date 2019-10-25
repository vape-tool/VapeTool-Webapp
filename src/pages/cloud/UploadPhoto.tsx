import React from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Col, Icon, message, Row, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { UploadPhotoState } from '@/models/uploadPhoto';

const { Dragger } = Upload;
const IMAGE_FORMAT = 'image/jpeg';
const IMAGE_QUALITY = 0.92;

interface UploadPhotoProps extends ConnectState {
  dispatch: Dispatch;
  uploadPhotoUrl: UploadPhotoState;
  submitting: boolean;
}

@connect(
  ({
    uploadPhoto,
    loading,
  }: {
    uploadPhoto: UploadPhotoState;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    uploadPhoto,
    submitting: loading.effects['userLogin/successLogin'],
  }),
)
class UploadPhoto extends React.PureComponent<UploadPhotoProps> {
  imageRef: HTMLImageElement | undefined = undefined;

  croppedFileUrl: string | undefined = undefined; // TODO move to redux state

  croppedWidth: number | undefined = undefined; // TODO move to redux state

  croppedHeight: number | undefined = undefined; // TODO move to redux state

  // If you setState the crop in here you should return false.
  onImageLoaded = (target: HTMLImageElement) => {
    this.imageRef = target;
    // Center a square percent crop.
    const width = target.width > target.height ? target.height : target.width;
    const height = target.height > target.width ? target.width : target.height;
    const x = width === target.width ? 0 : (target.width - width) / 2;
    const y = height === target.height ? 0 : (target.height - height) / 2;

    const crop: Crop = {
      unit: 'px',
      aspect: 1,
      width,
      height,
      x,
      y,
    };

    this.props.dispatch({
      type: 'uploadPhoto/setCrop',
      crop,
    });

    this.makeClientCrop(crop);
    return false;
  };

  onCropComplete = (crop: Crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop: Crop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.props.dispatch({
      type: 'uploadPhoto/setCrop',
      crop,
    });
  };

  getCroppedImgUrl(image: HTMLImageElement, crop: Crop): Promise<{ url: string; blob: Blob }> {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if (!crop.width || !crop.height) {
      throw new Error(
        `crop width ${crop.width} and crop height ${crop.height} must be positive number`,
      );
    }
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not retrieve context');
    }
    if (crop.x === undefined || crop.y === undefined) {
      throw new Error(`crop x: ${crop.x} and crop height ${crop.y} must be positive number`);
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise<{ url: string; blob: Blob }>(resolve => {
      canvas.toBlob(
        (blob: Blob | null) => {
          if (!blob) {
            // reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          if (this.croppedFileUrl) {
            window.URL.revokeObjectURL(this.croppedFileUrl);
          }
          this.croppedFileUrl = window.URL.createObjectURL(blob);
          this.croppedWidth = crop.width! * scaleX;
          this.croppedHeight = crop.height! * scaleY;
          resolve(Object.create({ url: this.croppedFileUrl, blob }));
        },
        IMAGE_FORMAT,
        IMAGE_QUALITY,
      );
    });
  }

  beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('Image must smaller than 20MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  getBase64 = (file: UploadFile) =>
    new Promise<string>((resolve, reject) => {
      if (!file.originFileObj) {
        return reject(new Error('Origin file object undefined'));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Can not process ArrayBuffer'));
        }
      };
      reader.onerror = error => reject(error);
      return reader;
    });

  onUploadChange = async (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const base64 = await this.getBase64(info.file);
      this.props.dispatch({
        type: 'uploadPhoto/setSrc',
        src: base64,
      });
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  postPhoto = () => {
    this.props.dispatch({
      type: 'uploadPhoto/postPhoto',
    });
  };

  resetPhoto = () => {
    this.props.dispatch({
      type: 'uploadPhoto/reset',
    });
  };

  onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch({
      type: 'uploadPhoto/setDescription',
      description: e.target.value,
    });
  };

  async makeClientCrop(crop: Crop) {
    if (this.imageRef && crop.width && crop.height) {
      const { url, blob } = await this.getCroppedImgUrl(this.imageRef, crop);
      this.props.dispatch({
        type: 'uploadPhoto/setCroppedImage',
        url,
        blob,
        width: this.croppedWidth,
        height: this.croppedHeight,
      });
    }
  }

  render() {
    const { crop, croppedImageUrl, src, description } = this.props.uploadPhoto;
    return (
      <div className="App">
        <Row type="flex">
          <Col xs={0} md={6}></Col>
          <Col xs={24} md={12}>
            <span
              style={{
                display: 'block',
                outline: 0,
                wordWrap: 'break-word',
                boxSizing: 'inherit',
                cursor: 'text',
                minHeight: 35,
                lineHeight: '37px',
                fontSize: 28,
                fontFamily: 'Proxima Nova Bold,Helvetica Neue,Helvetica,Arial,sans-serif',
              }}
              placeholder="Say something about this photo"
              onChange={this.onDescriptionChange}
              contentEditable
              spellCheck={false}
            >
              {description}
            </span>

            {!src && (
              <Dragger
                name="upload_photo"
                multiple={false}
                onChange={this.onUploadChange}
                beforeUpload={this.beforeUpload}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Please upload only vape related photos. Breaking those rules will result in
                  account suspension.
                </p>
              </Dragger>
            )}
            {src && (
              <ReactCrop
                imageStyle={{ maxHeight: '80vh' }}
                src={src}
                crop={crop}
                minHeight={100}
                minWidth={100}
                keepSelection
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            )}
            {croppedImageUrl && (
              <img alt="Crop" width={400} style={{ maxWidth: '100%' }} src={croppedImageUrl} />
            )}
            {croppedImageUrl && (
              <Row>
                <Col xs={6}>
                  <Button size="large" icon="close" block onClick={this.resetPhoto}>
                    Reset
                  </Button>
                </Col>
                <Col xs={18}>
                  <Button type="primary" size="large" block onClick={this.postPhoto}>
                    Post
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={0} md={6}></Col>
        </Row>
      </div>
    );
  }
}

export default UploadPhoto;
