import { AnyAction, Dispatch, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { User } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { setAuthority } from './utils/utils';
import { auth } from '@/utils/firebase';
import { getUser, initializeUser } from '@/services/user';
import { GLOBAL, REDIRECT_BACK } from '@/models/global';
import { SET_USER, USER } from '@/models/user';
import { getCurrentUserEditProfileUrl } from '@/places/user.places';

export function dispatchSuccessLogin(dispatch: Dispatch) {
  dispatch({
    type: 'userLogin/successLogin',
  });
}

export interface UserLoginModelState {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: UserLoginModelState) => T) => T },
) => void;

export interface UserLoginModelType {
  namespace: string;
  state: UserLoginModelState;
  effects: {
    successLogin: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<UserLoginModelState>;
  };
}

const Model: UserLoginModelType = {
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
      const callUser = call(getUser, firebaseUser.uid);
      let user: User | null = yield callUser as User;
      if (user == null) {
        // user not yet saved to database, saving now and redirecting to wizard page
        user = yield call(initializeUser, firebaseUser);
        yield put(routerRedux.replace({ pathname: getCurrentUserEditProfileUrl() }));
      } else {
        // user already initialized and saved on cloud
        yield put({ type: `${GLOBAL}/${REDIRECT_BACK}` });
      }
      const currentUser = {
        ...user,
        uid: firebaseUser.uid,
        display_name: user!.display_name || firebaseUser.displayName,
      };
      yield put({
        type: `${USER}/${SET_USER}`,
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
