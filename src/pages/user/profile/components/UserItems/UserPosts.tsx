import UserItems from '@/pages/user/profile/components/UserItems/index';
import { ItemName, Post } from '@/types';
import React from 'react';
import PostView from '@/components/ItemView/PostView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';
import { subscribePosts } from '@/services/items';
import { Dispatch } from 'redux';

@connect(({ userProfile, loading }: ConnectState) => ({
  userPosts: userProfile.userPosts,
  userProfile: userProfile.userProfile,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Post, { userPosts?: Post[] }> {
  what: ItemName = ItemName.POST;

  items = () => this.props.userPosts || [];

  renderItem = (item: Post) => <PostView item={item} />;

  subscribe = (dispatch: Dispatch, userId: string) => subscribePosts(this.props.dispatch, userId);
}

export default UserPosts;
