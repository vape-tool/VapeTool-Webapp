import { UserPermission } from '@vapetool/types';
import { CurrentUser } from './app';

export const canRemove = (authorId: string, currentUser?: CurrentUser) =>
  currentUser &&
  (authorId === currentUser.uid || currentUser.permission >= UserPermission.ONLINE_MODERATOR);

// src/access.ts
export default function access(initialState: {
  currentUser?: CurrentUser | undefined;
  firebaseUser?: firebase.User;
}) {
  const { currentUser, firebaseUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.permission === UserPermission.ONLINE_ADMIN,
    isNotAnonymous: firebaseUser && !firebaseUser.isAnonymous,
  };
}
