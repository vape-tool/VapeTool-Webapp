import { List } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import styles from '@/components/ItemView/index.less';
import { UserModelState } from '@/models/connect';
import { dispatchFetchUserItems, UserContent } from '@/models/user';
import PageLoading from '@/components/PageLoading';

export interface UserItemsProps extends Partial<UserModelState> {
  dispatch: Dispatch;
  loadingItems: boolean | undefined;
}

abstract class UserItems<T> extends Component<UserItemsProps> {
  abstract what: UserContent;

  abstract items: (props: UserItemsProps) => T[];

  abstract renderItem?: (item: T, index: number) => React.ReactNode;

  componentDidMount(): void {
    dispatchFetchUserItems(this.props.dispatch, this.what);
  }

  render() {
    const items = this.items(this.props);
    if (!items && this.props.loadingItems) {
      return <PageLoading/>;
    }
    return (
      <List<T>
        className={styles.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={items || []}
        renderItem={this.renderItem}
      />
    );
  }
}

export default UserItems;
