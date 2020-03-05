import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import React from 'react';
import { Coil } from '@/types';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import CoilView from '@/components/CoilView';

interface UserCoilsProps extends UserItemsProps {
  userCoils?: Coil[];
}

@connect(({ user, loading }: ConnectState) => ({
  userCoils: user.userCoils,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserCoils extends UserItems<Coil, UserCoilsProps> {
  what: CloudContent = CloudContent.COILS;

  items = () => this.props.userCoils || [];

  renderItem = (item: Coil) => <CoilView item={item} />;
}

export default UserCoils;
