import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Post } from '@/types';
import React from 'react';
import PostView from '@/components/ItemView/PostView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CloudContent, FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userPosts: userProfile.userPosts,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Post> {
  what: CloudContent = CloudContent.POSTS;

  items = () => this.props.userPosts || [];

  renderItem = (item: Post) => <PostView item={item} />;
}

export default UserPosts;
