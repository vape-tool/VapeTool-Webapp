import { auth } from '@/utils/firebase';
import { notifyToLogIn, logoutFirebaseWithRedirect } from './user';

export function verifyCurrentUser(): boolean {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    notifyToLogIn();
    return false;
  }
  return true;
}

export function verifyCurrentUserWithRedirect() {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    logoutFirebaseWithRedirect();
    return false;
  }
  return true;
}
