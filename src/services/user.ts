import { User as FirebaseUser } from 'firebase';
import { User } from '@vapetool/types';
import request from '@/utils/request';
import { auth, database, storage } from '@/utils/firebase';

export function getCurrentFirebaseUser(): Promise<FirebaseUser> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not logged in'));
      }
    });
  })
}

export function getUser(uid: string): Promise<User> {
  return new Promise((resolve, reject) => {
    database.ref(`users/${uid}`).once('value').then(snapshot => {
      const user = snapshot.val();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }).catch(e => reject(e));
  })
}

export function getUserAvatarUrl(uid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    storage.ref(`users/images/${uid}.jpg`).getDownloadURL().then(url => {
      if (url) {
        resolve(url);
      } else {
        reject(new Error('User image not found'));
      }
    }).catch(e => reject(e));
  })
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
