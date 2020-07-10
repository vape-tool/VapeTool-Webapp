import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Photo } from '@/types';
import React from 'react';
import PhotoView from '@/components/ItemView/PhotoView';
import { subscribePhotos } from '@/services/items';
import { CurrentUser } from '@/app';

interface Props {
  userId: string;
  currentUser: CurrentUser;
}

export default function UserPhotos({ userId, currentUser }: Props) {
  return (
    <UserItems<Photo>
      userId={userId}
      renderItem={(item: Photo) => (
        <PhotoView item={item} displayCommentsLength={5} currentUser={currentUser} />
      )}
      subscribe={subscribePhotos}
    />
  );
}