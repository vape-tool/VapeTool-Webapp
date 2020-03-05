import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import React from 'react';
import { Link } from '@/types';
import LinkView from '@/components/LinkView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface UserLinksProps extends UserItemsProps {
  userLinks?: Link[];
}

@connect(({ user, loading }: ConnectState) => ({
  userLinks: user.userLinks,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserLinks extends UserItems<Link, UserLinksProps> {
  what: CloudContent = CloudContent.LINKS;

  items = () => this.props.userLinks || [];

  renderItem = (item: Link) => <LinkView item={item} />;
}

export default UserLinks;
