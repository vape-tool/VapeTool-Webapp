import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/functions';
import { ItemName } from '@/types';
import { Mixable, Coil, MixResult, Liquid, Result, Properties } from '@vapetool/types';
import { IS_PRODUCTION } from './utils';

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

export function functions() {
  return IS_PRODUCTION ? prodApp.functions() : devApp.functions();
}

export function remoteConfig(): firebase.remoteConfig.RemoteConfig {
  return IS_PRODUCTION ? prodApp.remoteConfig() : devApp.remoteConfig();
}

export function database(): firebase.database.Database {
  return IS_PRODUCTION ? prodDb : devDb;
}

export function storage(): firebase.storage.Storage {
  return IS_PRODUCTION ? prodStorage : devStorage;
}

export const batteriesRef = prodDb.ref('batteries');
export const postsRef = database().ref('posts');
export const linksRef = database().ref('links');
export const photosRef = database().ref('gears');
export const usersRef = database().ref('users');
export const coilsRef = database().ref('coils');
export const liquidsRef = database().ref('liquids');
export const photoLikesRef = database().ref('gear-likes');
export const postLikesRef = database().ref('post-likes');
export const linkLikesRef = database().ref('link-likes');
export const coilLikesRef = database().ref('coil-likes');
export const liquidLikesRef = database().ref('liquid-likes');

export const likesRef = (item: ItemName) => {
  switch (item) {
    case ItemName.PHOTO:
      return photoLikesRef;
    case ItemName.POST:
      return postLikesRef;
    case ItemName.COIL:
      return coilLikesRef;
    case ItemName.LINK:
      return linkLikesRef;
    case ItemName.LIQUID:
      return liquidLikesRef;
    default:
      throw Error('illegal type');
  }
};

export const photoCommentsRef = database().ref('gear-comments');
export const postCommentsRef = database().ref('post-comments');
export const linkCommentsRef = database().ref('link-comments');
export const coilCommentsRef = database().ref('coil-comments');
export const liquidCommentsRef = database().ref('liquid-comments');

export const commentsRef = (item: ItemName) => {
  switch (item) {
    case ItemName.PHOTO:
      return photoCommentsRef;
    case ItemName.POST:
      return postCommentsRef;
    case ItemName.COIL:
      return coilCommentsRef;
    case ItemName.LINK:
      return linkCommentsRef;
    case ItemName.LIQUID:
      return liquidCommentsRef;
    default:
      throw Error('illegal type');
  }
};

export const batteriesStorageRef = prodStorage.ref('batteries').child('images');
export const usersStorageRef = storage().ref('users').child('images');
export const coilsStorageRef = storage().ref('coils').child('images');
export const photosStorageRef = storage().ref('gears').child('images');

export const { ServerValue } = firebase.database;

let userLoaded: boolean = false;

export function getCurrentUser(): Promise<firebase.User | undefined> {
  return new Promise<firebase.User | undefined>((resolve, reject) => {
    if (userLoaded) {
      resolve(auth.currentUser ?? undefined);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      userLoaded = true;
      unsubscribe();
      resolve(user ?? undefined);
    }, reject);
  });
}

export async function callFirebaseFunction<T extends MixResult | Result[] | Coil | Properties>(
  name:
    | 'calculateForResistance'
    | 'calculateForWraps'
    | 'calculateForProperties'
    | 'calculateForWrapsBasedOnPower'
    | 'calculateResults'
    | 'calculateForMix',
  data:
    | { mixable1: Mixable; mixable2: Mixable; preferences?: any }
    | { coil: Coil; baseVoltage?: number }
    | { coil: Coil; power: number; heatFlux: number }
    | { liquid: Liquid },
): Promise<T> {
  const res = await functions().httpsCallable(name)(data);
  return res.data as Promise<T>;
}

export async function createStripeManageLink(returnUrl: string): Promise<string> {
  const res = await functions().httpsCallable('createStripeManageLink')({ returnUrl });
  return res.data as string;
}

export async function createStripePayment(
  item: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const res = await functions().httpsCallable('createCheckoutSession')({
    item,
    successUrl,
    cancelUrl,
  });
  return res.data as string;
}

/**
 * @param interval - how often the subscription should be billed
 * @returns subscriptionId
 */
export async function createSubscriptionForUser(interval: 'monthly' | 'annually'): Promise<string> {
  const res = await functions().httpsCallable('createSubscriptionForUser')({
    interval,
  });
  const subscriptionId = res.data as string;
  return subscriptionId;
}
