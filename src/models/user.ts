import { Effect, Subscription } from 'dva';
import { Dispatch, Reducer } from 'redux';
import { User as FirebaseUser } from 'firebase/app';
import { routerRedux } from 'dva/router';
import { getUser, initializeUser, logoutFirebase } from '@/services/user';
import {
  getUserCoils,
  getUserLinks,
  getUserLiquids,
  getUserPhotos,
  getUserPosts,
} from '@/services/userCenter';
import { Photo, Post, Link, Coil, Liquid } from '@/types';
import { ConnectState } from '@/models/connect';
import { auth } from '@/utils/firebase';
import { User } from '@vapetool/types';
import moment from 'moment';
import { GLOBAL, REDIRECT_BACK } from '@/models/global';

export enum CloudContent {
  PHOTOS = 'photos',
  POSTS = 'posts',
  LINKS = 'links',
  COILS = 'coils',
  LIQUIDS = 'liquids',
}
export const USER = 'user';
export const FETCH_ITEMS = 'fetchItems';
export const LOGOUT = 'logout';
export const FETCH_CURRENT = 'fetchCurrent';
export const SET_USER = 'setUser';
export const SET_ITEMS = 'setItems';
export const SET_FIREBASE_USER = 'setFirebaseUser';
export const CLEAR_USER_STATE = 'clearUserState';

export function dispatchFetchUserItems(dispatch: Dispatch, what: CloudContent) {
  dispatch({
    type: `${USER}/${FETCH_ITEMS}`,
    what,
  });
}
export function dispatchFetchCurrentUser(dispatch: Dispatch) {
  dispatch({
    type: `${USER}/${FETCH_CURRENT}`,
  });
}

export function dispatchLogout(dispatch: Dispatch) {
  dispatch({
    type: `${USER}/${LOGOUT}`,
  });
}

export interface CurrentUser extends User {
  name: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  firebaseUser?: FirebaseUser;
  userPhotos?: Photo[];
  userPosts?: Post[];
  userLinks?: Link[];
  userCoils?: Coil[];
  userLiquids?: Liquid[];
}

export interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    [FETCH_CURRENT]: Effect;
    [LOGOUT]: Effect;
    [FETCH_ITEMS]: Effect;
  };
  reducers: {
    [SET_USER]: Reducer<UserModelState>;
    [SET_ITEMS]: Reducer<UserModelState>;
    [SET_FIREBASE_USER]: Reducer<UserModelState>;
    [CLEAR_USER_STATE]: Reducer<UserModelState>;
  };
  subscriptions: {
    firebaseUser: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: USER,

  state: {
    currentUser: undefined,
    userPhotos: undefined,
    firebaseUser: undefined,
  },

  effects: {
    // TODO try to unify with successfullyLogin
    *fetchCurrent(_, { put, call, select }) {
      const currentUser = yield select((state: ConnectState) => state.user.currentUser);
      if (currentUser) {
        return;
      }
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        // It should never happen
        console.error('restoreLogin with null firebaseUser');
        throw new Error('Success login with null firebaseUser');
      }
      console.log(`Current user logged in ${firebaseUser.uid}`);
      let user: User | null = yield call(getUser, firebaseUser.uid);
      if (user == null) {
        console.log('user not yet saved to database, saving now');
        user = yield call(initializeUser, firebaseUser);
        yield put(routerRedux.replace({ pathname: '/user/wizard' }));
        console.log(user);
      } else {
        console.log(`User is already created in db ${user}`);
      }
      const newCurrentUser = {
        ...user,
        uid: firebaseUser.uid,
        display_name: user!.display_name || firebaseUser.displayName,
      };
      yield put({
        type: SET_USER,
        currentUser: newCurrentUser,
      });
    },
    *logout(_, { call, put }) {
      yield call(logoutFirebase);
      yield put({
        type: SET_USER,
        currentUser: undefined,
      });

      yield put({
        type: `${GLOBAL}/${REDIRECT_BACK}`,
        path: '/login',
      });
    },
    *fetchItems({ what }, { put, call, select }) {
      const uid = yield select((state: ConnectState) => {
        if (state.user.currentUser) {
          return state.user.currentUser.uid;
        }
        return undefined;
      });
      if (!uid) {
        return;
      }

      let items;
      switch (what as CloudContent) {
        case CloudContent.PHOTOS:
          items = yield call(getUserPhotos, uid);
          break;
        case CloudContent.POSTS:
          items = yield call(getUserPosts, uid);
          break;
        case CloudContent.LINKS:
          items = yield call(getUserLinks, uid);
          break;
        case CloudContent.COILS:
          items = yield call(getUserCoils, uid);
          break;
        case CloudContent.LIQUIDS:
          items = yield call(getUserLiquids, uid);
          break;
        default:
          throw new Error(`Illegal type ${what}`);
      }

      yield put({
        type: SET_ITEMS,
        what,
        items: Array.isArray(items) ? items : [],
      });
    },
  },

  reducers: {
    setUser(state, { currentUser }): UserModelState {
      const tags = [];
      // TODO test
      if (moment(currentUser.subscription).isAfter()) {
        tags.push({ key: 'pro', label: 'Pro' });
      }
      return {
        ...(state as UserModelState),
        currentUser: {
          ...currentUser,
          tags,
          name: currentUser.display_name,
        },
      };
    },
    setFirebaseUser(state, { firebaseUser }): UserModelState {
      return {
        ...(state as UserModelState),
        firebaseUser,
      };
    },
    setItems(state, { what, items }): UserModelState {
      console.log({ what, setItems: items });
      return {
        ...(state as UserModelState),
        userPhotos: what === CloudContent.PHOTOS ? items : state?.userPhotos,
        userPosts: what === CloudContent.POSTS ? items : state?.userPosts,
        userLinks: what === CloudContent.LINKS ? items : state?.userLinks,
        userCoils: what === CloudContent.COILS ? items : state?.userCoils,
        userLiquids: what === CloudContent.LIQUIDS ? items : state?.userLiquids,
      };
    },
    clearUserState(): UserModelState {
      return {};
    },
  },
  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log(`onAuthStateChanged ${firebaseUser != null}`);
        if (!firebaseUser) {
          dispatch({ type: CLEAR_USER_STATE });
        } else {
          dispatch({ type: SET_FIREBASE_USER, firebaseUser });
        }
      });
    },
  },
};

export default UserModel;
