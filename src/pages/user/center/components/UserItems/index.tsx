import { List } from 'antd';
import React, { Component } from 'react';
import styles from '@/components/ItemView/index.less';
import { ConnectProps, UserModelState } from '@/models/connect';
import { dispatchFetchUserItems, CloudContent } from '@/models/user';
import PageLoading from '@/components/PageLoading';

export interface UserItemsProps extends Partial<UserModelState>, ConnectProps {
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
    console.log({ render: items });
    if (!items && this.props.loadingItems) {
      return <PageLoading />;
    }
    return (
      <List<T>
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={items}
        renderItem={this.renderItem}
      />
    );
  }
}

export default UserItems;