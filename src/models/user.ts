import { Effect, Subscription } from 'dva';
import { Dispatch, Reducer } from 'redux';
import { User as FirebaseUser } from 'firebase/app';
import { routerRedux } from 'dva/router';
import { getUser, initializeUser, logoutFirebase } from '@/services/user';
import { ConnectState } from '@/models/connect';
import { auth } from '@/utils/firebase';
import { User } from '@vapetool/types';
import moment from 'moment';
import { GLOBAL, REDIRECT_BACK } from '@/models/global';
import { getCurrentUserEditProfileUrl } from '@/places/user.places';

export const USER = 'user';
export const LOGOUT = 'logout';
export const FETCH_CURRENT = 'fetchCurrent';
export const SET_USER = 'setUser';
export const SET_FIREBASE_USER = 'setFirebaseUser';
export const CLEAR_USER_STATE = 'clearUserState';

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
}

export interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    [FETCH_CURRENT]: Effect;
    [LOGOUT]: Effect;
  };
  reducers: {
    [SET_USER]: Reducer<UserModelState>;
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
        yield put(routerRedux.replace({ pathname: getCurrentUserEditProfileUrl() }));
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
