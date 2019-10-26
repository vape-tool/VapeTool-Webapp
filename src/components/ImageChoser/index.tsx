import React from 'react';
import { Modal, notification } from 'antd';
import UploadAndCropImage from '@/components/UploadAndCropImage';

interface ImageChooserProps {
  visible: boolean;
  onCancel: () => any;
  onImageChoose: (imageUrl: string, imageBlob: Blob | File, width: number, height: number) => any;
  maxSize?: number;
  uploadHintText?: string;
}

interface ImageChooserState {
  imageUrl?: string;
  imageBlob?: Blob | File;
  width?: number;
  height?: number;
}

// This class introduce two utilities, firstly it shows Modal,
// secondary it allows to deffer passing new image until onOk is clicked,
// so the parent doesn't need to react to each new resizing
class ImageChooser extends React.Component<ImageChooserProps, ImageChooserState> {
  onResizeImage = (imageUrl: string, imageBlob: Blob | File, width: number, height: number) => {
    this.setState({
      imageUrl,
      imageBlob,
      width,
      height,
    });
  };

  onImageChoose = () => {
    const { imageUrl, imageBlob, width, height } = this.state;
    if (!imageUrl || !imageBlob || !width || !height) {
      notification.error({ message: "You didn't choose any image" });
      return;
    }
    this.props.onImageChoose(imageUrl, imageBlob, width, height);
  };

  onCancel = () => {
    this.setState({
      imageUrl: undefined,
      imageBlob: undefined,
      width: undefined,
      height: undefined,
    });
    this.props.onCancel();
  };

  render() {
    const { visible, maxSize, uploadHintText } = this.props;
    return (
      <Modal onOk={this.onImageChoose} onCancel={this.onCancel} visible={visible} closable={false}>
        <UploadAndCropImage
          uploadHintText={uploadHintText}
          onResizeImage={this.onResizeImage}
          maxSize={maxSize}
        />
      </Modal>
    );
  }
}

export default ImageChooser;
