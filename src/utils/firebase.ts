import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = require('@/firebase-config.json');

firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
export const auth = firebase.auth();
