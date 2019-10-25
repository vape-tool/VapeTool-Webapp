import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { User as FirebaseUser } from 'firebase/app';
import { User } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getUser, logoutFirebase, saveUser } from '@/services/user';
import { getUserPhotos } from '@/services/photo';
import { Photo } from '@/types/photo';
import { ConnectState } from '@/models/connect';
import { getPageQuery } from '@/utils/utils';
import { auth } from '@/utils/firebase';
import { getAvatarUrl } from '@/services/storage';

export interface CurrentUser extends User {
  name: string;
  avatar?: string;
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
}

export interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    logout: Effect;
    fetchCurrentUserPhotos: Effect;
  };
  reducers: {
    setUser: Reducer<UserModelState>;
    setUserPhotos: Reducer<UserModelState>;
    setFirebaseUser: Reducer<UserModelState>;
  };
  subscriptions: {
    firebaseUser: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
    userPhotos: undefined,
    firebaseUser: undefined,
  },

  effects: {
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
        user = yield call(saveUser, firebaseUser);
        console.log(user);
      } else {
        console.log(`User is already created in db ${user}`);
      }
      const callAvatarUrl = yield call(getAvatarUrl, firebaseUser.uid);
      const avatarUrl: string | null = yield callAvatarUrl;
      console.log(`avatarUrl: ${avatarUrl}`);
      const newCurrentUser = {
        ...user,
        uid: firebaseUser.uid,
        name: user!.display_name || firebaseUser.displayName,
        display_name: user!.display_name || firebaseUser.displayName,
        avatar: avatarUrl || firebaseUser.photoURL,
      };
      yield put({
        type: 'setUser',
        currentUser: newCurrentUser,
      });
    },
    *logout(_, { call, put }) {
      yield call(logoutFirebase);
      yield put({
        type: 'setUser',
        currentUser: undefined,
      });

      // TODO not sure if it's necessary since wrapper handle it for us
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
    *fetchCurrentUserPhotos(_, { put, call, select }) {
      const uid = yield select((state: ConnectState) => {
        if (state.user.currentUser) {
          return state.user.currentUser.uid;
        }
        return undefined;
      });
      if (!uid) {
        return;
      }
      const photos = yield call(getUserPhotos, uid);
      yield put({
        type: 'setUserPhotos',
        payload: Array.isArray(photos) ? photos : [],
      });
    },
  },

  reducers: {
    setUser(state, { currentUser }): UserModelState {
      return {
        ...(state as UserModelState),
        currentUser,
      };
    },
    setFirebaseUser(state, { firebaseUser }): UserModelState {
      return {
        ...(state as UserModelState),
        firebaseUser,
      };
    },
    setUserPhotos(state, action): UserModelState {
      return {
        ...(state as UserModelState),
        userPhotos: action.payload,
      };
    },
  },
  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log(`onAuthStateChanged ${firebaseUser != null}`);
        dispatch({ type: 'setFirebaseUser', firebaseUser });
      });
    },
  },
};

export default UserModel;
