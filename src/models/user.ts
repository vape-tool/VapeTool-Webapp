import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { Ban, User, UserPermission } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app'
import { getCurrentFirebaseUser, getUser, getUserAvatarUrl, logoutFirebase } from '@/services/user';
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
  title: string;
  group: string;
  signature: string;
  tags: {
    key: string;
    label: string;
  }[];
  unreadCount: number;
}

export interface UserModelState {
  currentUser: Partial<CurrentUser>;
  firebaseUser: Partial<FirebaseUser>;
  userPhotos: Photo[];
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
    currentUser: {},
    firebaseUser: {},
    userPhotos: [],
  },

  effects: {
    * fetchCurrentUser({ firebaseUser }, { call, put }) {
      if (!firebaseUser) {
        // if its called on demand then we need to fetch firebaseUser
        // eslint-disable-next-line no-param-reassign
        firebaseUser = yield call(getCurrentFirebaseUser);
      }
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
    * logout(_, { put, call }) {
      yield call(logoutFirebase);
      yield put({
        type: 'setUser',
        payload: { firebaseUser: undefined, currentUser: undefined },
      })
    },
    * fetchCurrentUserPhotos(_, { put, call, select }) {
      console.log('fetchCurrentUserPhotos');
      const uid = yield select((state: ConnectState) => state.user.currentUser.uid);
      console.log(`fetchCurrentUserPhotos uid: ${uid}`);
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
        currentUser: currentUser || {},
        firebaseUser: firebaseUser || {},
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
            payload: { firebaseUser },
          })
        }
      });
    },
  },
};

export default UserModel;
