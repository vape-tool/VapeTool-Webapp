import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Link } from '@/types';
import LinkView from '@/components/ItemView/LinkView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CloudContent, FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userLinks: userProfile.userLinks,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPosts extends UserItems<Link> {
  what: CloudContent = CloudContent.LINKS;

  items = () => this.props.userLinks || [];

  renderItem = (item: Link) => <LinkView item={item} />;
}

export default UserPosts;
