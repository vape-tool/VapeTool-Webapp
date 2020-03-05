import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Liquid } from '@/types';
import LiquidView from '@/components/LiquidView';

interface UserLiquidsProps extends UserItemsProps {
  userLiquids?: Liquid[];
}

@connect(({ user, loading }: ConnectState) => ({
  userLiquids: user.userLiquids,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserLiquids extends UserItems<Liquid, UserLiquidsProps> {
  what: CloudContent = CloudContent.LIQUIDS;

  items = () => this.props.userLiquids || [];

  renderItem = (item: Liquid) => <LiquidView item={item} />;
}

export default UserLiquids;
