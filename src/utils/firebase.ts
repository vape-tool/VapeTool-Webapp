import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = require('@/firebase-config.json');

firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export import ServerValue = firebase.database.ServerValue;
export import DataSnapshot = firebase.database.DataSnapshot;
export import Reference = firebase.database.Reference;
