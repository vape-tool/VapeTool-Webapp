import UserItems, { UserItemsProps } from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { CloudContent, FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

interface UserLiquidsProps extends UserItemsProps {
  userLiquids?: Liquid[];
}

@connect(({ userProfile, loading }: ConnectState) => ({
  userLiquids: userProfile.userLiquids,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserLiquids extends UserItems<Liquid, UserLiquidsProps> {
  what: CloudContent = CloudContent.LIQUIDS;

  items = () => this.props.userLiquids || [];

  renderItem = (item: Liquid) => <LiquidView item={item} />;
}

export default UserLiquids;
