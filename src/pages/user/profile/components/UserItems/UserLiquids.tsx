import UserItems from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { ItemName, Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';
import { subscribeLiquids } from '@/services/items';
import { Dispatch } from 'redux';

@connect(({ userProfile, loading }: ConnectState) => ({
  userLiquids: userProfile.userLiquids,
  userProfile: userProfile.userProfile,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserLiquids extends UserItems<Liquid, { userLiquids?: Liquid[] }> {
  what: ItemName = ItemName.LIQUID;

  items = () => this.props.userLiquids || [];

  renderItem = (item: Liquid) => <LiquidView item={item} />;

  subscribe = (dispatch: Dispatch, userId: string) => subscribeLiquids(this.props.dispatch, userId);
}

export default UserLiquids;
