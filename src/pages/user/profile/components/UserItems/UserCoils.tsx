import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil } from '@/types';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import CoilView from '@/components/ItemView/CoilView';
import { CloudContent, FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userLinks: userProfile.userLinks,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Coil> {
  what: CloudContent = CloudContent.COILS;

  items = () => this.props.userCoils || [];

  renderItem = (item: Coil) => <CoilView item={item} />;
}

export default UserPosts;
