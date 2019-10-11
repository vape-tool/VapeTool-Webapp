import { Effect } from 'dva';
import { Reducer } from 'redux';

import { User } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app';
import { logoutFirebase, saveUser } from '@/services/user';
import { getUserPhotos } from '@/services/photo';
import { Photo } from '@/types/photo';
import { ConnectState } from '@/models/connect';

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
    logout: Effect;
    saveUser: Effect;
    fetchCurrentUserPhotos: Effect;
  };
  reducers: {
    setUser: Reducer<UserModelState>;
    setUserPhotos: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
    firebaseUser: undefined,
    userPhotos: undefined,
  },

  effects: {
    * saveUser({ firebaseUser }, { call, put }) {
      const user = yield call(
        saveUser,
        firebaseUser.uid,
        firebaseUser.display_name,
        firebaseUser.email,
        firebaseUser.avatar,
      );
      yield put({
        type: 'setUser',
        payload: { firebaseUser, currentUser: user },
      });
    },
    * logout(_, { call }) {
      yield call(logoutFirebase);
    },
    * fetchCurrentUserPhotos(_, { put, call, select }) {
      const uid = yield select((state: ConnectState) =>
        // eslint-disable-next-line no-confusing-arrow
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      console.log(`fetchCurrentUserPhotos uid: ${uid}`);
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
    setUser(state, { payload: { firebaseUser, currentUser } }): UserModelState {
      console.log('setUser');
      console.log(currentUser);
      return {
        ...(state as UserModelState),
        currentUser,
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
};

export default UserModel;
