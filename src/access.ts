import { UserPermission } from '@vapetool/types';
import { CurrentUser } from './app';

export const canRemove = (authorId: string, currentUser: CurrentUser) =>
  authorId === currentUser.uid || currentUser.permission >= UserPermission.ONLINE_MODERATOR;

// src/access.ts
export default function access(initialState: { currentUser?: CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.permission === UserPermission.ONLINE_ADMIN,
  };
}
