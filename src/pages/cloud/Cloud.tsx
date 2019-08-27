import React from 'react';
import { List } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { Photo } from '@/types/photo';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import { PhotoModelState } from '@/models/photo';
import PhotoView from '@/components/PhotoView';

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
    <div style={{ textAlign: 'center' }}>
      <List<Photo>
        style={{ display: 'inline-block' }}
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={photos || []}
        renderItem={photo => <PhotoView photo={photo} dispatch={dispatch}/>}
      />
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photo,
}))(Cloud);
