import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/ItemView/PhotoView';
import { subscribePhotos } from '@/services/items';

interface Props {
  userId: string;
}

export default function UserPhotos({ userId }: Props) {
  return (
    <UserItems<Photo>
      userId={userId}
      renderItem={(item: Photo) => <PhotoView item={item} displayCommentsLength={5} />}
      subscribe={subscribePhotos}
    />
  );
}
