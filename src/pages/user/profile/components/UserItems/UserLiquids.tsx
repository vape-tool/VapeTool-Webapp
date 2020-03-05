import UserItems from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { ItemName, Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userLiquids: userProfile.userLiquids,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserLiquids extends UserItems<Liquid, { userLiquids?: Liquid[] }> {
  what: ItemName = ItemName.LIQUID;

  items = () => this.props.userLiquids || [];

  renderItem = (item: Liquid) => <LiquidView item={item} />;
}

export default UserLiquids;
