import UserItems from '@/pages/user/profile/components/UserItems/index';
import React from 'react';
import { Link } from '@/types';
import LinkView from '@/components/ItemView/LinkView';
import { subscribeLinks } from '@/services/items';
import { CurrentUser } from '@/app';

interface Props {
  userId: string;
  currentUser: CurrentUser;
}

export default function UserLinks({ userId, currentUser }: Props) {
  return (
    <UserItems<Link>
      userId={userId}
      renderItem={(item: Link) => (
        <LinkView item={item} displayCommentsLength={5} currentUser={currentUser} />
      )}
      subscribe={subscribeLinks}
    />
  );
}