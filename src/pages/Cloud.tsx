import React from 'react';
import 'firebase/auth';
import { Card, List } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { Photo } from '@/types/photo';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import { PhotoModelState } from '@/models/photo';

interface AuthComponentProps extends ConnectProps {
  photo: PhotoModelState;
  dispatch: Dispatch;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const { photo: { photos } } = props;


  return (
    <div>
      <List<Photo>
        className={styles.coverCardList}
        rowKey="uid"
        grid={{ gutter: 24, xxl: 4, xl: 4, lg: 3, md: 3, sm: 3, xs: 1 }}
        dataSource={photos || []}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.description} src={item.url}/>}
            >
              <Card.Meta title={<a>{item.description}</a>}/>
              <div className={styles.cardItemContent}>
                <span>{moment(item.lastTimeModified).fromNow()}</span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default connect(({ photo }: ConnectState) => ({
  photo,
}))(Cloud);
