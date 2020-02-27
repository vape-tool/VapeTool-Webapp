import { CloudContent } from '@/models/user';
import UserItems from '@/pages/user/center/components/UserItems';
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Liquid } from '@/types';
import LiquidView from '@/components/LiquidView';

@connect(({ user, loading }: ConnectState) => ({
  userLiquids: user.userLiquids,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserLiquids extends UserItems<Liquid> {
  what: CloudContent = CloudContent.COILS;

  items = () => this.props.userLiquids || [];

  renderItem = (item: Liquid) => <LiquidView item={item} />;
}

export default UserLiquids;
