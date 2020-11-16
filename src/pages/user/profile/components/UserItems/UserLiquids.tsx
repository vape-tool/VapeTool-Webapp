import UserItems from '@/pages/user/profile/components/UserItems';
import React from 'react';
import { Liquid } from '@/types';
import LiquidView from '@/components/ItemView/LiquidView';
import { subscribeLiquids } from '@/services/items';

interface Props {
  userId: string;
}

export default function UserLiquids({ userId }: Props) {
  return (
    <UserItems<Liquid>
      userId={userId}
      renderItem={(item: Liquid) => <LiquidView item={item} />}
      subscribe={subscribeLiquids}
    />
  );
}
