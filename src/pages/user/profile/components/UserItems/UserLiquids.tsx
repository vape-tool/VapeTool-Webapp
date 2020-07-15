import UserItems from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { subscribeLiquids } from '@/services/items';
import { CurrentUser } from '@/app';
import { useModel } from 'umi';

interface Props {
  userId: string;
}

export default function UserLiquids({ userId }: Props) {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser as CurrentUser;
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
