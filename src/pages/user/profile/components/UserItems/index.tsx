import { List } from 'antd';
import React, { Component } from 'react';
import styles from '@/components/ItemView/styles.less';
import PageLoading from '@/components/PageLoading';
import { UserProfileModelState } from '@/models/userProfile';
import { ConnectProps } from '@/models/connect';
import { Item, ItemName } from '@/types';
import { Dispatch } from 'redux';

export interface UserItemsProps extends Partial<UserProfileModelState>, ConnectProps {
  loadingItems?: boolean;
}

abstract class UserItems<T extends Item, P> extends Component<P & UserItemsProps> {
  // eslint-disable-next-line react/sort-comp
  abstract what: ItemName;

  abstract items: () => T[];

  abstract renderItem: (item: T, index: number) => React.ReactNode;

  abstract subscribe: (dispatch: Dispatch, userId: string) => () => void;

  offItemsSubscription: (() => void) | undefined;

  componentDidMount(): void {
    if (this.props.userProfile?.uid) {
      this.offItemsSubscription = this.subscribe(this.props.dispatch, this.props.userProfile?.uid);
    }
  }

  componentWillUnmount(): void {
    if (this.offItemsSubscription) this.offItemsSubscription();
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
