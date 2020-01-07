import { Card, List } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../ItemView/index.less';
import { ConnectState, UserModelState } from '@/models/connect';
import { Liquid } from '@/types';

@connect(({ user }: ConnectState) => ({
  userLiquids: user.userLiquids,
}))
class UserLiquids extends Component<Partial<UserModelState>> {
  render() {
    const { userLiquids } = this.props;
    console.log('userLiquids');
    console.dir(userLiquids);
    return (
      <List<Liquid>
        className={styles.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={userLiquids || []}
        renderItem={item => (
          <List.Item>
            <Card className={styles.card} hoverable>
              <Card.Meta title={item.name} description={item.description}/>
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

export default UserLiquids;
