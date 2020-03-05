import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import { Post } from '@/types';
import React from 'react';
import PostView from '@/components/PostView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface UserPhotosProps extends UserItemsProps {
  userPosts?: Post[];
}

@connect(({ user, loading }: ConnectState) => ({
  userPosts: user.userPosts,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPosts extends UserItems<Post, UserPhotosProps> {
  what: CloudContent = CloudContent.POSTS;

  items = () => this.props.userPosts || [];

  renderItem = (item: Post) => <PostView item={item} />;
}

export default UserPosts;
