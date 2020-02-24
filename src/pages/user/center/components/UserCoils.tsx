import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import React from 'react';
import { Coil } from '@/types';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import CoilView from '@/components/CoilView';

@connect(({ user, loading }: ConnectState) => ({
  userLinks: user.userLinks,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPosts extends UserItems<Coil> {
  what: CloudContent = 'coils';

  items = (props: UserItemsProps) => props.userCoils || [];

  renderItem = (item: Coil) => <CoilView item={item} />;
}

export default UserPosts;
