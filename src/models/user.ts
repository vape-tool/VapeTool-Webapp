import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { User } from '@vapetool/types';
import { User as FirebaseUser } from 'firebase/app'
import { getCurrentFirebaseUser, getUser, logoutFirebase, query as queryUsers, queryCurrent } from '@/services/user';
import { auth } from '@/utils/firebase';

export interface CurrentUser {
  uid?: string;
  avatar?: string;
  name?: string;
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
  user?: User;
  firebaseUser?: FirebaseUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    logout: Effect;
    fetch: Effect;
    fetchCurrentUser: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    setUser: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
  subscriptions: {
    firebaseUser: Subscription
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    user: undefined,
    firebaseUser: undefined,
  },

  effects: {

    * logout(_, { call }) {
      yield call(logoutFirebase);
    },
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchCurrentUser(_, { call, put }) {
      const response = yield call(getCurrentFirebaseUser);
      if (response) {
        const firebaseUser = response as FirebaseUser;
        const responseUser = yield call(getUser, firebaseUser.uid);
        if (responseUser) {
          const user = responseUser as User;
          yield put({
            type: 'setUser',
            payload: { user, firebaseUser },
          });
        }
      }
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    setUser(state, { payload: { user, firebaseUser } }) {
      console.log(`setUser user: ${user} firebaseUser: ${firebaseUser}`);

      return {
        ...state,
        user,
        firebaseUser,
      }
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },

  subscriptions: {
    firebaseUser({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        console.log(`onAuthStateChanged ${firebaseUser}`);
        if (firebaseUser) {
          getUser(firebaseUser.uid).then(user => dispatch({
            type: 'setUser',
            payload: { user, firebaseUser },
          })).catch(_ => dispatch({
              type: 'setUser',
              payload: { user: undefined, firebaseUser },
            }),
          )
        } else {
          dispatch({
            type: 'setUser',
            payload: { user: undefined, firebaseUser: undefined },
          })
        }
      });
    },
  },
};

export default UserModel;
