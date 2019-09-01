import { Modal } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { Photo } from '@/types/photo';
import PhotoView from '@/components/PhotoView';

interface PhotoPreviewModalProps {
  dispatch: Dispatch
  user?: CurrentUser
  selectedPhoto?: Photo
}

const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> =
  (props: PhotoPreviewModalProps) => {
    const { dispatch, selectedPhoto } = props;
    console.log(`selected ${selectedPhoto}`);
    const onCancel = () => {
      dispatch({
        type: 'photo/selectPhoto',
        photo: undefined,
      })
    };
    return (
      <Modal
        footer={null}
        centered
        bodyStyle={{ padding: 0 }}
        visible={selectedPhoto !== undefined}
        onCancel={onCancel}>
        {selectedPhoto &&
        <PhotoView photo={selectedPhoto}
                   dispatch={dispatch}
                   displayCommentsLength={Number.MAX_SAFE_INTEGER}/>
        }
      </Modal>
    )
  };

export default connect(({ photo, user }: ConnectState) => ({
  user: user.currentUser,
  selectedPhoto: photo.selectedPhoto,
}))(PhotoPreviewModal);
