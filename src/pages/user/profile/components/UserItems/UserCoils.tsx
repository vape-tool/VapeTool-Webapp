import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil } from '@/types';
import CoilView from '@/components/ItemView/CoilView';
import { subscribeCoils } from '@/services/items';
import { CurrentUser } from '@/app';
import { useModel } from 'umi';

interface UserCoilsProps {
  userId: string;
}

export default function UserCoils({ userId }: UserCoilsProps) {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser as CurrentUser;
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
