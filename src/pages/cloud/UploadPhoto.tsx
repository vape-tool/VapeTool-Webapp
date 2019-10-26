import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Col, Icon, Input, Row } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { UploadPhotoState } from '@/models/uploadPhoto';
import ImageChooser from '@/components/ImageChoser';

interface UploadPhotoProps {
  dispatch: Dispatch;
  uploadPhoto: UploadPhotoState;
  showPhotoChooser: boolean;
  submitting: boolean;
}

const UploadPhoto: React.FC<UploadPhotoProps> = props => {
  const { croppedImageUrl, description, showPhotoChooser, cancelled } = props.uploadPhoto;
  const { dispatch } = props;
  const postPhoto = () => dispatch({ type: 'uploadPhoto/postPhoto' });
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'uploadPhoto/setDescription',
      description: e.target.value,
    });
  };

  const onPhotoChoose = (url: string, blob: Blob | File, width: number, height: number) => {
    dispatch({
      type: 'uploadPhoto/setCroppedImage',
      url,
      blob,
      width,
      height,
    });
  };
  const showNewPhotoChooser = () => dispatch({ type: 'uploadPhoto/showPhotoChooser' });
  const hideNewPhotoChooser = () => dispatch({ type: 'uploadPhoto/hidePhotoChooser' });

  return (
    <div className="App">
      <Row type="flex">
        <Col xs={0} md={4} lg={6} xl={8} />
        <Col xs={24} md={16} lg={14} xl={10}>
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
                <Icon type="plus" style={{ color: '#999' }} />
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
        </Col>
        <Col xs={0} md={4} lg={6} xl={8} />
      </Row>
      <ImageChooser
        visible={showPhotoChooser === true || (!cancelled && !croppedImageUrl)}
        onCancel={hideNewPhotoChooser}
        onImageChoose={onPhotoChoose}
        maxSize={800}
      />
    </div>
  );
};

export default connect(
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
)(UploadPhoto);
