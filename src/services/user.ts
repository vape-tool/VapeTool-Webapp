import { User, UserPermission } from '@vapetool/types';
import firebase from 'firebase';
import request from '@/utils/request';
import { auth, database } from '@/utils/firebase';

export function getUser(uid: string): Promise<User | null> {
  return new Promise(resolve => {
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

export function initializeUser(firebaseUser: firebase.User): Promise<User | null> {
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

export function updateDisplayName(uid: string, displayName: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    if (!displayName) {
      console.error('Displayname can not be empty');
      reject(new Error('Displayname can not be empty'));
    }
    return database
      .ref(`users/${uid}`)
      .update({
        display_name: displayName,
      })
      .then(() => getUser(uid))
      .then(resolve)
      .catch(reject);
  });
}

function uploadAvatar(avatarUrl: string) {
  console.log(avatarUrl);
  request.get(avatarUrl, { responseType: 'blob' }).then(response => {
    console.log('uploadAvatar Response');
    console.log(response);
  });
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

export async function logoutFirebase(): Promise<void> {
  return auth
    .signOut()
    .then(() => console.log('signed out complete'))
    .catch(err => console.error(err));
}
