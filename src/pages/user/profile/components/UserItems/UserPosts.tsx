import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Post } from '@/types';
import React from 'react';
import PostView from '@/components/ItemView/PostView';
import { subscribePosts } from '@/services/items';
import { CurrentUser } from '@/app';

interface Props {
  userId: string;
  currentUser: CurrentUser;
}

export default function UserPosts({ userId, currentUser }: Props) {
  return (
    <UserItems<Post>
      userId={userId}
      renderItem={(item: Post) => (
        <PostView item={item} displayCommentsLength={5} currentUser={currentUser} />
      )}
      subscribe={subscribePosts}
    />
  );
}
