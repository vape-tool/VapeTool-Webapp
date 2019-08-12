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
    <div>
      <List<Photo>
        className={styles.coverCardList}
        rowKey="uid"
        grid={{ gutter: 24, xxl: 4, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={photos || []}
        renderItem={photo => <PhotoView photo={photo} dispatch={dispatch}/>}
      />
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photo,
}))(Cloud);
