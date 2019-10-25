import { Card, List } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import { ConnectState, UserModelState } from '@/models/connect';
import { Photo } from '@/types/photo';

@connect(({ user }: ConnectState) => ({
  userPhotos: user.userPhotos,
}))
class UserPhotos extends Component<Partial<UserModelState>> {
  render() {
    const { userPhotos } = this.props;
    console.log('userPhotos');
    console.dir(userPhotos);
    return (
      <List<Photo>
        className={styles.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={userPhotos || []}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.description} src={item.url} />}
            >
              <Card.Meta title={<a>{item.description}</a>} />
              <div className={styles.cardItemContent}>
                <span>{moment(item.lastTimeModified).fromNow()}</span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default UserPhotos;
