import { CloudContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import { Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/PhotoView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface UserPhotosProps extends UserItemsProps {
  userPhotos?: Photo[];
}

@connect(({ user, loading }: ConnectState) => ({
  userPhotos: user.userPhotos,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPhotos extends UserItems<Photo, UserPhotosProps> {
  what: CloudContent = CloudContent.PHOTOS;

  items = () => this.props.userPhotos || [];

  renderItem = (item: Photo) => <PhotoView item={item} />;
}

export default UserPhotos;
