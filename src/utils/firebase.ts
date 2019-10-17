import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { User as FirebaseUser } from 'firebase';

const firebaseConfig = require('@/firebase-config.json');

firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
export const storage = firebase.storage();
export const auth: firebase.auth.Auth = firebase.auth();

let userLoaded: boolean = false;

export function getCurrentUser(): Promise<FirebaseUser | null> {
  return new Promise<FirebaseUser | null>((resolve, reject) => {
    if (userLoaded) {
      resolve(auth.currentUser);
    }
    const unsubscribe = auth.onAuthStateChanged(user => {
      userLoaded = true;
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
