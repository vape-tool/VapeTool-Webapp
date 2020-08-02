import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Link } from '@/types';
import LinkView from '@/components/ItemView/LinkView';
import { subscribeLinks } from '@/services/items';

interface Props {
  userId: string;
}

export default function UserLinks({ userId }: Props) {
  return (
    <UserItems<Link>
      userId={userId}
      renderItem={(item: Link) => <LinkView item={item} displayCommentsLength={5} />}
      subscribe={subscribeLinks}
    />
  );
}
