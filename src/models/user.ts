import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { Ban, User, UserPermission } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app'
import { getUser, getUserAvatarUrl, logoutFirebase } from '@/services/user';
import { auth } from '@/utils/firebase';
import { getUserPhotos } from '@/services/photo';
import { Photo } from '@/types/photo';
import { ConnectState } from '@/models/connect';

export interface CurrentUser extends User {
  uid: string;
  avatar: string;
  name: string;
  email: string;
  pro: boolean;
  setup: boolean;
  permission: UserPermission;
  ban?: Ban;
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
    fetchCurrentUser: Effect;
    fetchCurrentUserPhotos: Effect;
  };
  reducers: {
    setUser: Reducer<UserModelState>;
    setUserPhotos: Reducer<UserModelState>;
  };
  subscriptions: {
    firebaseUser: Subscription
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
    * fetchCurrentUser({ firebaseUser }, { call, put }) {
      if (firebaseUser) {
        const callUser = call(getUser, firebaseUser.uid);
        const callAvatarUrl = call(getUserAvatarUrl, firebaseUser.uid);
        const user = yield callUser as User;
        const avatarUrl = yield callAvatarUrl;
        const currentUser = {
          uid: firebaseUser.uid,
          name: user.display_name || firebaseUser.displayName,
          avatar: avatarUrl || firebaseUser.photoURL,
        };
        yield put({
          type: 'setUser',
          payload: { firebaseUser, currentUser },
        });
      }
    },
    * logout(_, { call }) {
      yield call(logoutFirebase);
    },
    * fetchCurrentUserPhotos(_, { put, call, select }) {
      const uid = yield select((state: ConnectState) => (state.user.currentUser !== undefined ?
        state.user.currentUser.uid : undefined));
      console.log(`fetchCurrentUserPhotos uid: ${uid}`);
      if (!uid) {
        return
      }
      const photos = yield call(getUserPhotos, uid);
      yield put({
        type: 'setUserPhotos',
        payload: Array.isArray(photos) ? photos : [],
      })
    },
  },

  reducers: {
    setUser(state, { payload: { firebaseUser, currentUser } }): UserModelState {
      return {
        ...(state as UserModelState),
        currentUser,
        firebaseUser,
      }
    },
    setUserPhotos(state, action): UserModelState {
      return {
        ...(state as UserModelState),
        userPhotos: action.payload,
      }
    },
  },

  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log('onAuthStateChanged');
        console.dir(firebaseUser);
        if (firebaseUser) {
          dispatch({
            type: 'fetchCurrentUser',
            firebaseUser,
          })
        } else {
          dispatch({
            type: 'setUser',
            payload: { firebaseUser: undefined, currentUser: undefined },
          })
        }
      });
    },
  },
};

export default UserModel;
