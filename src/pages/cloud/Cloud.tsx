import React from 'react';
import { List } from 'antd';
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
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photos: photo.photos,
}))(Cloud);
