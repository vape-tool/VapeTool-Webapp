import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { updateDisplayName } from '@/services/user';
import { getPageQuery } from '@/utils/utils';

export interface UserWizardState {
  displayName?: string;
  avatarUrl?: string;
  newImageUrl?: string;
}

export interface ModelType {
  namespace: string;
  state: UserWizardState;
  effects: {
    saveUser: Effect;
  };
  reducers: {
    setDisplayName: Reducer<UserWizardState>;
    setAvatarUrl: Reducer<UserWizardState>;
    setNewImageUrl: Reducer<UserWizardState>;
  };
}

const UserWizardModel: ModelType = {
  namespace: 'userWizard',

  state: {
    displayName: undefined,
    avatarUrl: undefined,
    newImageUrl: undefined,
  },

  effects: {
    *saveUser(_, { put, call, select }) {
      const displayName = yield select((state: UserWizardState) => state.displayName);
      const currentUser = yield call(updateDisplayName, displayName);
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
    setAvatarUrl(state, { avatarUrl }) {
      return {
        ...state,
        avatarUrl,
      };
    },
    setDisplayName(state, { displayName }) {
      return {
        ...state,
        displayName,
      };
    },
    setNewImageUrl(state, { newImageUrl }) {
      return {
        ...state,
        newImageUrl,
      };
    },
  },
};

export default UserWizardModel;
