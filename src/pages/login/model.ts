import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { User } from '@vapetool/types';
import { getPageQuery, setAuthority } from './utils/utils';
import { auth } from '@/utils/firebase';
import { getUser, saveUser } from '@/services/user';
import { getAvatarUrl } from '@/services/storage';

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
        user = yield call(saveUser, firebaseUser);
        console.log(user);
      } else {
        console.log(`User is already created in db ${user}`);
      }
      const callAvatarUrl = yield call(getAvatarUrl, firebaseUser.uid);
      const avatarUrl: string | null = yield callAvatarUrl;
      console.log(`avatarUrl: ${avatarUrl}`);
      const currentUser = {
        ...user,
        uid: firebaseUser.uid,
        name: user!.display_name || firebaseUser.displayName,
        display_name: user!.display_name || firebaseUser.displayName,
        avatar: avatarUrl || firebaseUser.photoURL,
      };
      // TODO can we remove it from here and call it only from SecurityLayout
      yield put({
        type: 'user/setUser',
        currentUser,
      });
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params as { redirect: string };
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }

      console.log(`isAbout to redirect to ${redirect || '/'}`);
      yield put(routerRedux.replace(redirect || '/'));
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
