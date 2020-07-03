import UserItems from '@/pages/user/profile/components/UserItems/index';
import { ItemName, Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/ItemView/PhotoView';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { FETCH_ITEMS, USER_PROFILE } from '@/models/userProfile';
import { subscribePhotos } from '@/services/items';

@connect(({ userProfile, loading }: ConnectState) => ({
  userPhotos: userProfile.userPhotos,
  userProfile: userProfile.userProfile,
  loadingItems: loading.effects[`${USER_PROFILE}/${FETCH_ITEMS}`],
}))
class UserPhotos extends UserItems<Photo, { userPhotos?: Photo[] }> {
  what: ItemName = ItemName.PHOTO;

  items = () => this.props.userPhotos || [];

  renderItem = (item: Photo) => <PhotoView item={item} />;

  subscribe = (dispatch: Dispatch, userId: string) => subscribePhotos(this.props.dispatch, userId);
}

export default UserPhotos;
