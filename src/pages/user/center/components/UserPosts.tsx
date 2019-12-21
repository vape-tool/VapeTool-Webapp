import { UserContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import { Post } from '@/types';
import React from 'react';
import PostView from '@/components/PostView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

@connect(({ user, loading }: ConnectState) => ({
  userPosts: user.userPosts,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPosts extends UserItems<Post> {
  what: UserContent = 'posts';

  items = (props: UserItemsProps) => props.userPosts || [];

  renderItem = (item: Post) => (<PostView item={item}/>);
}

export default UserPosts;
