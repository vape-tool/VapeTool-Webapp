import { List } from 'antd';
import React, { Component } from 'react';
import styles from '@/components/ItemView/index.less';
import { ConnectProps } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import { CloudContent, dispatchFetchUserItems, UserProfileModelState } from '@/models/userProfile';

export interface UserItemsProps extends Partial<UserProfileModelState>, Partial<ConnectProps> {
  loadingItems?: boolean;
}

abstract class UserItems<T> extends Component<UserItemsProps> {
  abstract what: CloudContent;

  abstract items: () => T[];

  abstract renderItem: (item: T, index: number) => React.ReactNode;

  // eslint-disable-next-line react/sort-comp
  componentDidMount(): void {
    dispatchFetchUserItems(this.props.dispatch!, this.what);
  }

  render() {
    const items = this.items();
    if (this.props.loadingItems) {
      return <PageLoading />;
    }
    return (
      <List<T>
        className={styles.coverCardList}
        style={{ marginBottom: 0 }}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={items}
        renderItem={this.renderItem}
      />
    );
  }
}

export default UserItems;
