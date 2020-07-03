import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { ItemName, Link } from '@/types';
import LinkView from '@/components/ItemView/LinkView';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';
import { subscribePosts } from '@/services/items';

@connect(({ userProfile, loading }: ConnectState) => ({
  userLinks: userProfile.userLinks,
  userProfile: userProfile.userProfile,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Link, { userLinks?: Link[] }> {
  what: ItemName = ItemName.LINK;

  items = () => this.props.userLinks || [];

  renderItem = (item: Link) => <LinkView item={item} />;

  subscribe = (dispatch: Dispatch, userId: string) => subscribePosts(this.props.dispatch, userId);
}

export default UserPosts;
