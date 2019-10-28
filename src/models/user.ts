import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { User as FirebaseUser } from 'firebase/app';
import { User } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { getUser, initializeUser, logoutFirebase } from '@/services/user';
import { getUserPhotos } from '@/services/photo';
import { Photo } from '@/types/photo';
import { ConnectState } from '@/models/connect';
import { auth } from '@/utils/firebase';

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
    clearUserState: Reducer<UserModelState>;
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

      yield put({
        type: 'global/redirectTo',
        path: '/login',
      });
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
        currentUser: {
          ...currentUser,
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
    setUserPhotos(state, action): UserModelState {
      return {
        ...(state as UserModelState),
        userPhotos: action.payload,
      };
    },
    clearUserState(state): UserModelState {
      return {
        ...(state as UserModelState),
        firebaseUser: undefined,
        userPhotos: undefined,
      };
    },
  },
  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log(`onAuthStateChanged ${firebaseUser != null}`);
        if (!firebaseUser) {
          dispatch({ type: 'clearUserState' });
        } else {
          dispatch({ type: 'setFirebaseUser', firebaseUser });
        }
      });
    },
  },
};

export default UserModel;
