import { User, UserPermission } from '@vapetool/types';
import firebase from 'firebase';
import request from '@/utils/request';
import { auth, database } from '@/utils/firebase';

export function getUser(uid: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    database
      .ref(`users/${uid}`)
      .once('value')
      .then(snapshot => {
        const user = snapshot.val();
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      })
      .catch(e => {
        console.error(e);
        resolve(null);
      });
  });
}

export function saveUser(firebaseUser: firebase.User): Promise<User | null> {
  const { uid, email, photoURL, displayName } = firebaseUser;
  if (photoURL) {
    uploadAvatar(photoURL);
  }
  return database
    .ref(`users/${uid}`)
    .update({
      uid,
      display_name: displayName || 'Anonymous',
      email,
      permission: UserPermission.ONLINE_USER,
    })
    .then(() => getUser(uid));
}

function uploadAvatar(avatarUrl: string) {
  // TODO push avator to storage
}

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export function logoutFirebase(): Promise<void> {
  return auth.signOut();
}
