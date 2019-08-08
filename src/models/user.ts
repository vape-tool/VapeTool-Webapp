import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { Ban, User, UserPermission } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app'
import { getCurrentFirebaseUser, getUser, getUserAvatarUrl, logoutFirebase, } from '@/services/user';
import { auth } from '@/utils/firebase';

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
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    logout: Effect;
    fetchCurrentUser: Effect;
  };
  reducers: {
    setUser: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
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
  },

  reducers: {
    setUser(state, { payload: { firebaseUser, currentUser } }) {
      console.log(`setUser firebaseUser: ${firebaseUser}`);
      console.log(`setUser firebaseUser: ${firebaseUser}`);
      return {
        ...state,
        currentUser,
        firebaseUser,
      }
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },

  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log(`onAuthStateChanged ${firebaseUser}`);
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
