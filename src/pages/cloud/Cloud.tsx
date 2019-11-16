import React from 'react';
import { Affix, Button, List } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Photo } from '@/types/photo';
import styles from '@/pages/user/center/components/UserPhotos/index.less';
import PhotoView from '@/components/PhotoView';
import PhotoPreviewModal from '@/components/PhotoPreviewModal';

interface AuthComponentProps extends ConnectProps {
  photos: Photo[];
  dispatch: Dispatch;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const onUploadPhotoClicked = () =>
    props.dispatch &&
    props.dispatch({
      type: 'global/redirectTo',
      path: '/cloud/upload-photo',
    });

  const { photos } = props;

  return (
    <div>
      <List<Photo>
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={photos}
        renderItem={photo => <PhotoView displayCommentsLength={3} photo={photo}/>}
      />
      <PhotoPreviewModal/>
      <Affix offsetBottom={30} offset={60}>
        <Button
          type="primary"
          icon="plus"
          shape="circle"
          size="large"
          onClick={onUploadPhotoClicked}
        />
      </Affix>
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photos: photo.photos,
}))(Cloud);
