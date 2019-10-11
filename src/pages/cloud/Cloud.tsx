import React from 'react';
import { List } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Photo } from '@/types/photo';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import { PhotoModelState } from '@/models/photo';
import PhotoView from '@/components/PhotoView';
import PhotoPreviewModal from '@/components/PhotoPreviewModal';
import { Dispatch } from 'redux';

interface AuthComponentProps extends ConnectProps {
  photo: PhotoModelState;
  dispatch: Dispatch;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const {
    photo: { photos },
    dispatch,
  } = props;

  return (
    <div>
      <List<Photo>
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={photos || []}
        renderItem={photo => (
          <PhotoView displayCommentsLength={3} photo={photo} dispatch={dispatch} />
        )}
      />
      <PhotoPreviewModal />
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photo,
}))(Cloud);
