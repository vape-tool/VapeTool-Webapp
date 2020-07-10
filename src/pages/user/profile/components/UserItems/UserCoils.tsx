import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil } from '@/types';
import CoilView from '@/components/ItemView/CoilView';
import { subscribeCoils } from '@/services/items';
import { CurrentUser } from '@/app';

interface UserCoilsProps {
  userId: string;
  currentUser: CurrentUser;
}

export default function UserCoils({ userId, currentUser }: UserCoilsProps) {
  return (
    <UserItems<Coil>
      userId={userId}
      renderItem={(item: Coil) => (
        <CoilView item={item} displayCommentsLength={5} currentUser={currentUser} />
      )}
      subscribe={subscribeCoils}
    />
  );
}
