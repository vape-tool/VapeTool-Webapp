import { auth } from '@/utils/firebase';
import { notifyToLogIn } from './user';

export function verifyCurrentUser(): boolean {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    notifyToLogIn();
    return false;
  }
  return true;
}
