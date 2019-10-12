import React from 'react';
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Col, Icon, Input, message, Row, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { UploadPhotoState } from '@/pages/cloud/model';

const { Dragger } = Upload;

interface UploadPhotoProps extends ConnectState {
  dispatch: Dispatch
  uploadPhoto: UploadPhotoState
  submitting: boolean
}

@connect(({ uploadPhoto, loading }: {
    uploadPhoto: UploadPhotoState,
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

  fileUrl: string | undefined = undefined;

  // If you setState the crop in here you should return false.
  onImageLoaded = (target: HTMLImageElement) => {
    this.imageRef = target;
    // Center a square percent crop.
    const width = target.width > target.height ? (target.height / target.width) * 100 : 100;
    const height = target.height > target.width ? (target.width / target.height) * 100 : 100;
    const x = width === 100 ? 0 : (100 - width) / 2;
    const y = height === 100 ? 0 : (100 - height) / 2;

    this.props.dispatch({
      type: 'uploadPhoto/setCrop',
      crop: {
        unit: '%',
        aspect: 1,
        width,
        height,
        x,
        y,
      },
    });
    return false;
  };

  onCropComplete = (crop: Crop, percentCrop: PercentCrop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop: Crop, percentCrop: PercentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.props.dispatch({
      type: 'uploadPhoto/setCrop',
      crop,
    });
  };


  getCroppedImg(image: HTMLImageElement, crop: Crop, fileName: string): Promise<string> {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if (!crop.width || !crop.height) {
      throw new Error(`crop width ${crop.width} and crop height ${crop.height} must be positive number`)
    }
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not retrieve context')
    }
    if (crop.x === undefined || crop.y === undefined) {
      throw new Error(`crop x: ${crop.x} and crop height ${crop.y} must be positive number`)
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        if (this.fileUrl) {
          window.URL.revokeObjectURL(this.fileUrl);
        }
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  beforeUpload = (file: RcFile, FileList: RcFile[]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };


  getBase64 = (file: UploadFile) => new Promise<string>((resolve, reject) => {
    if (!file.originFileObj) {
      return reject(new Error('Origin file object undefined'))
    }
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Can not process ArrayBuffer'))
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

  postImage = () => {
    this.props.dispatch({
      type: 'postImage',
    })
  };

  async makeClientCrop(crop: Crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg',
      );
      this.props.dispatch({
        type: 'uploadPhoto/setCroppedImageUrl',
        croppedImageUrl,
      });
    }
  }

  render() {
    const { crop, croppedImageUrl, src } = this.props.uploadPhoto;
    return (
      <div className="App">
        <Row type="flex">
          <Col xs={0} md={6}>
          </Col>
          <Col xs={24} md={12}>

            <Input size="large" style={{ padding: '20px 20px 20px 20px' }}
                   placeholder="Say something about this photo"/>

            {!src && <Dragger name="upload_photo" multiple={false}
                              onChange={this.onUploadChange}
                              beforeUpload={this.beforeUpload}>

                <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Please upload only vape related photos. Breaking those rules will result
                    in
                    account suspension.</p>
            </Dragger>
            }
            {src && (
              <ReactCrop
                imageStyle={{ maxHeight: '80vh' }}
                src={src}
                crop={crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            )}
            {croppedImageUrl && (
              <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl}/>
            )}
            {src && (
              <Button type="primary" icon="check" size="large" style={{ float: 'right' }} onClick={this.postImage}>
                Post
              </Button>
            )}
          </Col>
          <Col xs={0} md={6}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UploadPhoto;
