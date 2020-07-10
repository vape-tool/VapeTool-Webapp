import UserItems from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { subscribeLiquids } from '@/services/items';
import { CurrentUser } from '@/app';

interface Props {
  userId: string;
  currentUser: CurrentUser;
}

export default function UserLiquids({ userId, currentUser }: Props) {
  return (
    <UserItems<Liquid>
      userId={userId}
      renderItem={(item: Liquid) => (
        <LiquidView item={item} displayCommentsLength={5} currentUser={currentUser} />
      )}
      subscribe={subscribeLiquids}
    />
  );
}