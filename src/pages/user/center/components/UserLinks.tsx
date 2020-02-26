import { CloudContent } from '@/models/user';
import UserItems from '@/pages/user/center/components/UserItems';
import React from 'react';
import { Link } from '@/types';
import LinkView from '@/components/LinkView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

@connect(({ user, loading }: ConnectState) => ({
  userLinks: user.userLinks,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPosts extends UserItems<Link> {
  what: CloudContent = CloudContent.LINKS;

  items = () => this.props.userLinks || [];

  renderItem = (item: Link) => <LinkView item={item} />;
}

export default UserPosts;
