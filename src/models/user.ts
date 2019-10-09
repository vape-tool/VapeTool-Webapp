import { Effect } from 'dva';
import { Reducer } from 'redux';

import { User } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app';
import { getUser, logoutFirebase, saveUser } from '@/services/user';
import { auth } from '@/utils/firebase';
import { getUserPhotos } from '@/services/photo';
import { Photo } from '@/types/photo';
import { ConnectState } from '@/models/connect';
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
    logout: Effect;
    updateUserState: Effect;
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
    * updateUserState(_, { call, put }) {
      const firebaseUser = auth.currentUser;
      console.log('onAuthStateChanged');
      console.dir(firebaseUser);
      if (firebaseUser) {
        // Success login
        const callUser = call(getUser, firebaseUser.uid);
        let user: User | null = yield callUser as User;
        if (user == null) {
          user = yield call(saveUser, firebaseUser);
          // TODO check if this return nonull
        }
        const callAvatarUrl = yield call(getAvatarUrl, firebaseUser.uid);
        const avatarUrl: string | null = yield callAvatarUrl;
        const currentUser = {
          ...user,
          uid: firebaseUser.uid,
          name: user!.display_name || firebaseUser.displayName,
          display_name: user!.display_name || firebaseUser.displayName,
          avatar: avatarUrl || firebaseUser.photoURL,
        };
        yield put({
          type: 'setUser',
          payload: { firebaseUser, currentUser },
        });
      } else {
        // Logout
        yield put({
          type: 'setUser',
          payload: { firebaseUser: undefined, currentUser: undefined },
        });
      }
    },
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
