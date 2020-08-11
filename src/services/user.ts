import { User, UserPermission } from '@vapetool/types';
import firebase from 'firebase';
import { request, history } from 'umi';
import { auth, usersRef } from '@/utils/firebase';
import { uploadAvatar } from '@/services/storage';
import { notification } from 'antd';

export function getUser(uid: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    usersRef
      .child(uid)
      .once('value')
      .then((snapshot) => {
        const user = snapshot.val();
        if (user) {
          resolve(user);
        } else {
          resolve(undefined);
        }
      })
      .catch((e) => {
        console.error(e);
        resolve(undefined);
      });
  });
}

export function initializeUser(firebaseUser: firebase.User): Promise<User | undefined> {
  const { uid, email, photoURL, displayName } = firebaseUser;
  if (photoURL) {
    initializeAvatar(photoURL, uid);
  }
  return usersRef
    .child(uid)
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
    return usersRef
      .child(uid)
      .update({
        display_name: displayName,
      })
      .then(() => getUser(uid))
      .then(resolve)
      .catch(reject);
  });
}

function initializeAvatar(avatarUrl: string, userId: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', avatarUrl);
  xhr.responseType = 'blob';
  xhr.onreadystatechange = function onResolve() {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;

    // Process the response
    if (xhr.status >= 200 && xhr.status < 300) {
      // If successful
      uploadAvatar(this.response, userId)
        .then(() => console.log('Successfully uploaded user cloud'))
        .catch((e) => console.error(e));
    } else {
      // If failed
      console.error(`Failed to fetch user avatar from
      url: ${avatarUrl} status: ${this.status} statusText: ${this.statusText}`);
    }
  };
  xhr.send();
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
    .catch((err) => console.error(err));
}

export function notifyToLogIn() {
  notification.open({
    message: 'Only for logged users!',
    description: 'Click on the notification to redirect to login page',
    style: {
      cursor: 'pointer',
    },
    onClick: () => {
      logoutFirebase();
      history.replace('/login');
    },
  });
}
