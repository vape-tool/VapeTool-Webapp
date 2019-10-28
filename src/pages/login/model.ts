import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { User } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { setAuthority } from './utils/utils';
import { auth } from '@/utils/firebase';
import { getUser, initializeUser } from '@/services/user';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    successLogin: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    // TODO try to unify with fetchCurrent
    *successLogin(_, { put, call }) {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        // It should never happen
        throw new Error('Success login with null firebaseUser');
      }
      console.log(`Successfully logged in ${firebaseUser.uid}`);
      const callUser = call(getUser, firebaseUser.uid);
      let user: User | null = yield callUser as User;
      if (user == null) {
        console.log('user not yet saved to database, saving now');
        user = yield call(initializeUser, firebaseUser);
        console.log(user);
        yield put(routerRedux.replace({ pathname: '/user/wizard' }));
      } else {
        console.log(`User is already created in db ${user}`);
        yield put({ type: 'global/redirectBack' });
      }
      const currentUser = {
        ...user,
        uid: firebaseUser.uid,
        display_name: user!.display_name || firebaseUser.displayName,
      };
      yield put({
        type: 'user/setUser',
        currentUser,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
