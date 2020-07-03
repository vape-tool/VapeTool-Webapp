import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil, ItemName } from '@/types';
import { connect, Dispatch  } from 'umi';
import { ConnectState } from '@/models/connect';
import CoilView from '@/components/ItemView/CoilView';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';
import { subscribeCoils } from '@/services/items';

@connect(({ userProfile, loading }: ConnectState) => ({
  userCoils: userProfile.userCoils,
  userProfile: userProfile.userProfile,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserCoils extends UserItems<Coil, { userCoils?: Coil[] }> {
  what: ItemName = ItemName.COIL;

  items = () => this.props.userCoils || [];

  renderItem = (item: Coil) => <CoilView item={item} />;

  subscribe = (dispatch: Dispatch, userId: string) => subscribeCoils(this.props.dispatch, userId);
}

export default UserCoils;
