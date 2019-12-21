import { UserContent } from '@/models/user';
import UserItems, { UserItemsProps } from '@/pages/user/center/components/UserItems';
import { Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/PhotoView';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

@connect(({ user, loading }: ConnectState) => ({
  userPhotos: user.userPhotos,
  loadingItems: loading.effects['user/fetchItems'],
}))
class UserPhotos extends UserItems<Photo> {
  what: UserContent = 'photos';

  items = (props: UserItemsProps) => props.userPhotos || [];

  renderItem = (item: Photo) => (<PhotoView item={item}/>);
}

export default UserPhotos;
