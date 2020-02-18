import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { User as FirebaseUser } from 'firebase';

const firebaseProdConfig = require('@/firebase-config.json');

const firebaseDevConfig = require('@/firebase-config-dev.json');
// firebaseConfig.databaseURL = 'ws://localhost:5555';

const devApp = firebase.initializeApp(firebaseDevConfig);
const devDb = devApp.database();
const devStorage = devApp.storage();
export const auth: firebase.auth.Auth = devApp.auth();

const prodApp = firebase.initializeApp(firebaseProdConfig, 'prod');
const prodDb = prodApp.database();
const prodStorage = prodApp.storage();

export function database(): firebase.database.Database {
  return devDb
}

export function storage(): firebase.storage.Storage {
  return devStorage
}

export const batteriesRef = prodDb.ref('batteries');
export const postsRef = database().ref('posts');
export const linksRef = database().ref('links');
export const photosRef = database().ref('gears');
export const usersRef = database().ref('users');

export const batteriesStorageRef = prodStorage.ref('batteries').child('images');
export const usersStorageRef = storage().ref('users').child('images');
export const coilsStorageRef = storage().ref('coils').child('images');
export const photosStorageRef = storage().ref('gears').child('images');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import ServerValue = firebase.database.ServerValue;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DataSnapshot = firebase.database.DataSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import DatabaseReference = firebase.database.Reference;
export import StorageReference = firebase.storage.Reference;

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
