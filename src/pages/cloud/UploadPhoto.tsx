import React, { useState } from 'react';
import { Button, Card, Input } from 'antd';
import { useIntl, FormattedMessage, useModel } from 'umi';
import UploadAndCropImage from '@/components/UploadAndCropImage';
import { CaretLeftOutlined, ShareAltOutlined } from '@ant-design/icons';
import { CurrentUser } from '@/app';

const UploadPhoto: React.FC = () => {
  const { description, setDescription, submitPhoto, croppedImage, setCroppedImage } = useModel(
    'uploadPhoto',
  );
  const [isCropping, setIsCropping] = useState(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser as CurrentUser;

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
    submitPhoto(currentUser);
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
        placeholder={useIntl().formatMessage({
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

export default UploadPhoto;
