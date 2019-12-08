import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { User as FirebaseUser } from 'firebase';

// const firebaseConfig = require('@/firebase-config.json');
const firebaseConfig = require('@/firebase-config-dev.json');
// firebaseConfig.databaseURL = 'ws://localhost:5555';
firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
export const storage = firebase.storage();
export const auth: firebase.auth.Auth = firebase.auth();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import ServerValue = firebase.database.ServerValue;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DataSnapshot = firebase.database.DataSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Reference = firebase.database.Reference;

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
