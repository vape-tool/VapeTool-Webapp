import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Coil } from '@/types';
import CoilView from '@/components/ItemView/CoilView';
import { subscribeCoils } from '@/services/items';

interface UserCoilsProps {
  userId: string;
}

export default function UserCoils({ userId }: UserCoilsProps) {
  return (
    <UserItems<Coil>
      userId={userId}
      renderItem={(item: Coil) => <CoilView item={item} />}
      subscribe={subscribeCoils}
    />
  );
}
