import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil, ItemName } from '@/types';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import CoilView from '@/components/ItemView/CoilView';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userCoils: userProfile.userCoils,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserCoils extends UserItems<Coil, { userCoils?: Coil[] }> {
  what: ItemName = ItemName.COIL;

  items = () => this.props.userCoils || [];

  renderItem = (item: Coil) => <CoilView item={item} />;
}

export default UserCoils;
