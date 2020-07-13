import React from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button, Card, message, Upload, Typography } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, InboxOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';

import 'react-image-crop/dist/ReactCrop.css';
import { FormattedMessage } from 'umi';

const { Dragger } = Upload;

interface CropAndUploadImageProps {
  maxSize?: number;
  onResizeImage?: (url: string, blob: Blob | File, width: number, height: number) => any;
  uploadHintText?: string;
  onConfirm?: () => void;
}

interface CropAndUploadImageState {
  sourceImage?: string;
  crop?: ReactCrop.Crop;
  croppedImageUrl?: string;
  croppedImageBlob?: Blob | File;
  description?: string;
  width?: number;
  height?: number;
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error('Image must smaller than 20MB!');
  }
  return isJpgOrPng && isLt2M;
}

function getBase64(file: UploadFile) {
  return new Promise<string>((resolve, reject) => {
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
    reader.onerror = (error) => reject(error);
    return reader;
  });
}

const IMAGE_FORMAT = 'image/jpeg';
const IMAGE_QUALITY = 0.92;

class UploadAndCropImage extends React.PureComponent<
  CropAndUploadImageProps,
  CropAndUploadImageState
> {
  state = {
    sourceImage: undefined,
    crop: undefined,
  };

  // this is <img> element reference from <ReactCrop> element
  imageRef: HTMLImageElement | undefined = undefined;

  // We use global variable because it allow to revoke previously loaded image
  // so we have only one croppedFile at a time
  croppedFileUrl: string | undefined = undefined;

  onUploadChange = async (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const sourceImage = await getBase64(info.file);
      this.setState({ sourceImage });
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  onImageLoaded = (target: HTMLImageElement) => {
    // set the reference to <img> object so it can be used later in makeClientCrop
    // which doesn't have access to this element
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

    this.onCropChange(crop);
    this.makeClientCrop(crop);

    // If you setState the crop in here you should return false.
    return false;
  };

  onCropChange = (crop: Crop) => this.setState({ crop });

  getCroppedImgUrl = (
    crop: Crop,
  ): Promise<{ url: string; blob: Blob; width: number; height: number }> => {
    const image: HTMLImageElement = this.imageRef!;
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
    if (this.props.maxSize) {
      canvas.width = Math.min(this.props.maxSize, canvas.width);
      canvas.height = Math.min(this.props.maxSize, canvas.height);
    }
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
      this.props.maxSize ? Math.min(this.props.maxSize, crop.width * scaleX) : crop.width * scaleX,
      this.props.maxSize
        ? Math.min(this.props.maxSize, crop.height * scaleX)
        : crop.height * scaleX,
    );

    return new Promise((resolve) => {
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
          const width = crop.width! * scaleX;
          const height = crop.height! * scaleY;
          resolve(Object.create({ blob, width, height }));
        },
        IMAGE_FORMAT,
        IMAGE_QUALITY,
      );
    });
  };

  makeClientCrop = async (crop: Crop) => {
    if (this.imageRef && crop.width && crop.height) {
      const { blob, width, height } = await this.getCroppedImgUrl(crop);
      if (this.props.onResizeImage) {
        this.props.onResizeImage(this.croppedFileUrl!, blob, width, height);
      }
    }
  };

  onResetSourceImage = () => this.setState({ sourceImage: undefined });

  render() {
    const { sourceImage, crop } = this.state;
    const { uploadHintText, onConfirm } = this.props;

    return (
      <>
        {!sourceImage && (
          <Dragger
            name="file"
            multiple={false}
            onChange={this.onUploadChange}
            beforeUpload={beforeUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              <FormattedMessage
                id="user.uploadPhoto.clickOrDrag"
                defaultMessage="Click or drag file to this area to upload"
              />
            </p>
            <p className="ant-upload-hint">
              {uploadHintText || (
                <Typography>
                  Please upload only vape related photos. Breaking those rules will result in
                  account suspension.
                </Typography>
              )}
            </p>
          </Dragger>
        )}
        {sourceImage && (
          <Card style={{ textAlign: 'center' }}>
            <ReactCrop
              imageStyle={{ maxHeight: '80vh' }}
              src={sourceImage!}
              crop={crop}
              minHeight={100}
              minWidth={100}
              keepSelection
              onImageLoaded={this.onImageLoaded}
              onComplete={this.makeClientCrop}
              onChange={this.onCropChange}
            />

            <div style={{ marginTop: 24 }}>
              <Button type="default" onClick={this.onResetSourceImage} style={{ marginRight: 12 }}>
                <CaretLeftOutlined />
                <FormattedMessage id="user.uploadPhoto.uploadAgain" defaultMessage="Upload again" />
              </Button>
              {onConfirm && (
                <Button type="primary" onClick={onConfirm}>
                  <FormattedMessage id="misc.actions.continue" defaultMessage="Continue" />
                  <CaretRightOutlined />
                </Button>
              )}
            </div>
          </Card>
        )}
      </>
    );
  }
}

export default UploadAndCropImage;
