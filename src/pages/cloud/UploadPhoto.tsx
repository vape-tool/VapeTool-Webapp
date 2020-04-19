import React, { useState } from 'react';
import { Button, Card, Input } from 'antd';
import { connect } from 'dva';
import {
  CroppedImage,
  dispatchSetCroppedImage,
  dispatchSetDescription,
  SUBMIT,
  submitPhoto,
  UPLOAD_PHOTO,
  UploadPhotoState,
} from '@/models/uploadPhoto';
import { ConnectProps, ConnectState } from '@/models/connect';
import UploadAndCropImage from '@/components/UploadAndCropImage';
import { CaretLeftOutlined, ShareAltOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

interface UploadPhotoProps extends ConnectProps {
  uploadPhoto: UploadPhotoState;
  showPhotoChooser: boolean;
  submitting?: boolean;
}

const UploadPhoto: React.FC<UploadPhotoProps> = props => {
  const { dispatch } = props;

  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState<CroppedImage>({});
  const [description, setDescription] = useState('');

  const onResizeImage = (
    imageUrl: string,
    imageBlob: Blob | File,
    width: number,
    height: number,
  ) => {
    setCroppedImage({
      imageUrl,
      imageBlob,
      width,
      height,
    });
  };

  const postPhoto = () => {
    dispatchSetCroppedImage(dispatch, croppedImage);
    dispatchSetDescription(dispatch, description);
    submitPhoto(dispatch);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const photoUploaded = (
    <Card style={{ textAlign: 'center' }}>
      <Input
        style={{
          display: 'block',
          outline: 0,
          wordWrap: 'break-word',
          boxSizing: 'inherit',
          cursor: 'text',
          minHeight: 50,
          lineHeight: '37px',
          fontSize: 28,
          fontFamily: 'Proxima Nova Bold,Helvetica Neue,Helvetica,Arial,sans-serif',
          border: 0,
        }}
        placeholder={formatMessage({
          id: 'user.uploadPhoto.saySomething',
          defaultMessage: 'Say something about this photo',
        })}
        onChange={onDescriptionChange}
        value={description}
      />

      <img
        alt="Crop"
        width="100%"
        style={{ maxWidth: '100%' }}
        src={croppedImage.imageUrl}
        onClick={() => setIsCropping(true)}
      />

      <div style={{ marginTop: 24 }}>
        <Button type="default" onClick={() => setIsCropping(true)} style={{ marginRight: 12 }}>
          <CaretLeftOutlined />
          <FormattedMessage id="user.uploadPhoto.cropAgain" defaultMessage="Crop again" />
        </Button>
        <Button type="primary" onClick={postPhoto}>
          <FormattedMessage id="user.actions.publishPost" defaultMessage="Publish post" />
          <ShareAltOutlined />
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="App">
      <div style={{ display: isCropping ? 'block' : 'none' }}>
        <UploadAndCropImage
          onResizeImage={onResizeImage}
          onConfirm={() => setIsCropping(false)}
          maxSize={800}
        />
      </div>

      {!isCropping && photoUploaded}
    </div>
  );
};

export default connect(({ uploadPhoto, loading }: ConnectState) => ({
  uploadPhoto,
  submitting: loading.effects[`${UPLOAD_PHOTO}/${SUBMIT}`],
}))(UploadPhoto);
