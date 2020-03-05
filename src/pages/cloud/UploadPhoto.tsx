import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Col, Input, Row } from 'antd';
import { connect } from 'dva';
import {
  UploadPhotoState,
  submitPhoto,
  SUBMIT,
  UPLOAD_PHOTO,
  HIDE_PHOTO_CHOOSER,
  SHOW_PHOTO_CHOOSER,
  SET_CROPPED_IMAGE,
  SET_DESCRIPTION,
} from '@/models/uploadPhoto';
import ImageChooser from '@/components/ImageChoser';
import { PlusOutlined } from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';

interface UploadPhotoProps extends ConnectProps {
  uploadPhoto: UploadPhotoState;
  showPhotoChooser: boolean;
  submitting?: boolean;
}

const UploadPhoto: React.FC<UploadPhotoProps> = props => {
  const { dispatch, uploadPhoto } = props;
  const { croppedImageUrl, description, showPhotoChooser, cancelled } = uploadPhoto;

  const postPhoto = () => submitPhoto(dispatch);
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: `${UPLOAD_PHOTO}/${SET_DESCRIPTION}`,
      description: e.target.value,
    });
  };

  const onPhotoChoose = (url: string, blob: Blob | File, width: number, height: number) => {
    dispatch({
      type: `${UPLOAD_PHOTO}/${SET_CROPPED_IMAGE}`,
      url,
      blob,
      width,
      height,
    });
  };
  const showNewPhotoChooser = () => dispatch({ type: `${UPLOAD_PHOTO}/${SHOW_PHOTO_CHOOSER}` });
  const hideNewPhotoChooser = () => dispatch({ type: `${UPLOAD_PHOTO}/${HIDE_PHOTO_CHOOSER}` });

  return (
    <div className="App">
      {croppedImageUrl && (
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
          placeholder="Say something about this photo"
          onChange={onDescriptionChange}
          value={description}
        />
      )}
      {!croppedImageUrl && (
        <div
          style={{
            display: 'table',
            float: 'left',
            verticalAlign: 'top',
            width: '100%',
            height: 300,
            backgroundColor: '#fafafa',
            cursor: 'pointer',
            textAlign: 'center',
            border: '1px dashed #d9d9d9',
            borderRadius: 4,
            boxSizing: 'border-box',
            fontSize: 30,
          }}
          onClick={showNewPhotoChooser}
        >
          <div
            style={{
              textAlign: 'center',
              display: 'table-cell',
              width: '100%',
              height: '100%',
              verticalAlign: 'middle',
            }}
          >
            <PlusOutlined style={{ color: '#999' }} />
            <div className="ant-upload-text" style={{ color: '#666' }}>
              Click to upload photo
            </div>
          </div>
        </div>
      )}
      {croppedImageUrl && (
        <img
          alt="Crop"
          width="100%"
          style={{ maxWidth: '100%' }}
          src={croppedImageUrl}
          onClick={showNewPhotoChooser}
        />
      )}
      {croppedImageUrl && (
        <Row>
          <Col xs={24}>
            <Button type="primary" size="large" block onClick={postPhoto}>
              Post
            </Button>
          </Col>
        </Row>
      )}
      <ImageChooser
        visible={showPhotoChooser === true || (!cancelled && !croppedImageUrl)}
        onCancel={hideNewPhotoChooser}
        onImageChoose={onPhotoChoose}
        maxSize={800}
      />
    </div>
  );
};

export default connect(({ uploadPhoto, loading }: ConnectState) => ({
  uploadPhoto,
  submitting: loading.effects[`${UPLOAD_PHOTO}/${SUBMIT}`],
}))(UploadPhoto);
