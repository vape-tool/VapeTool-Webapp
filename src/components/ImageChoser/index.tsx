import React, { useState } from 'react';
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

/**
 * This class introduce two utilities, firstly it shows Modal,
 * secondary it allows to deffer passing new image until onOk is clicked,
 * so the parent doesn't need to react to each new resizing
 */
const ImageChooser: React.FC<ImageChooserProps> = (props: ImageChooserProps) => {
  const [state, setState] = useState<ImageChooserState>();

  const onResizeImage = (
    imageUrl: string,
    imageBlob: Blob | File,
    width: number,
    height: number,
  ) => {
    setState({
      imageUrl,
      imageBlob,
      width,
      height,
    });
  };

  const onImageChoose = () => {
    if (state) {
      const { imageUrl, imageBlob, width, height } = state;
      if (!imageUrl || !imageBlob || !width || !height) {
        notification.error({ message: "You didn't choose any image" });
        return;
      }
      props.onImageChoose(imageUrl, imageBlob, width, height);
    } else {
      notification.error({ message: "You didn't choose any image" });
    }
  };

  const onCancel = () => {
    setState({
      imageUrl: undefined,
      imageBlob: undefined,
      width: undefined,
      height: undefined,
    });
    props.onCancel();
  };
  const { visible, maxSize, uploadHintText } = props;
  return (
    <Modal onOk={onImageChoose} onCancel={onCancel} visible={visible} closable={false}>
      <UploadAndCropImage
        uploadHintText={uploadHintText}
        onResizeImage={onResizeImage}
        maxSize={maxSize}
      />
    </Modal>
  );
};

export default ImageChooser;
