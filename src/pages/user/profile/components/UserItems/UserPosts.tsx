import UserItems from '@/pages/user/profile/components/UserItems/index';
import { ItemName, Post } from '@/types';
import React from 'react';
import PostView from '@/components/ItemView/PostView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userPosts: userProfile.userPosts,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Post, { userPosts?: Post[] }> {
  what: ItemName = ItemName.POST;

  items = () => this.props.userPosts || [];

  renderItem = (item: Post) => <PostView item={item} />;
}

export default UserPosts;
