import UserItems from '@/pages/user/profile/components/UserItems/index';
import { Post } from '@/types';
import React from 'react';
import PostView from '@/components/ItemView/PostView';
import { subscribePosts } from '@/services/items';

interface Props {
  userId: string;
}

export default function UserPosts({ userId }: Props) {
  return (
    <UserItems<Post>
      userId={userId}
      renderItem={(item: Post) => <PostView item={item} displayCommentsLength={5} />}
      subscribe={subscribePosts}
    />
  );
}
