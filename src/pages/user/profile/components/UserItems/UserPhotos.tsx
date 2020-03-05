import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/ItemView/PhotoView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CloudContent, FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';

@connect(({ userProfile, loading }: ConnectState) => ({
  userPhotos: userProfile.userPhotos,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPhotos extends UserItems<Photo> {
  what: CloudContent = CloudContent.PHOTOS;

  items = () => this.props.userPhotos || [];

  renderItem = (item: Photo) => <PhotoView item={item} />;
}

export default UserPhotos;
