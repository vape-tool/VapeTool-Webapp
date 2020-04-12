import { Card, List } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { WireType } from '@vapetool/types';
import { ConnectState, UserModelState } from '@/models/connect';
import { Coil } from '@/types';
import styles from '../ItemView/styles.less';

@connect(({ user }: ConnectState) => ({
  userCoils: user.userCoils,
}))
class UserCoils extends Component<Partial<UserModelState>> {
  render() {
    const { userCoils } = this.props;
    console.log('userCoils');
    console.dir(userCoils);
    return (
      <List<Coil>
        className={styles.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={userCoils || []}
        renderItem={item => (
          <List.Item>
            <Card className={styles.card} hoverable>
              <Card.Meta title={WireType[item.type]} description={<a>{item.description}</a>} />
              <div className={styles.cardItemContent}>
                <span>
                  {moment(item.lastTimeModified)
                    .locale('en')
                    .fromNow()}
                </span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default UserCoils;
