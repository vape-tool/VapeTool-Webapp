import { Effect } from 'dva';
import { Dispatch, Reducer } from 'redux';
import { User } from '@vapetool/types';
import { getUser } from '@/services/user';
import { routerRedux } from 'dva/router';
import { Coil, Link, Liquid, Photo, Post } from '@/types';
import { ConnectState } from '@/models/connect';
import {
  getUserCoils,
  getUserLinks,
  getUserLiquids,
  getUserPhotos,
  getUserPosts,
} from '@/services/userCenter';
import moment from 'moment';

export enum CloudContent {
  PHOTOS = 'photos',
  POSTS = 'posts',
  LINKS = 'links',
  COILS = 'coils',
  LIQUIDS = 'liquids',
}

export const USER_PROFILE = 'userProfile';
export const SET_USER_PROFILE = 'setUserProfile';
export const FETCH_USER_PROFILE = 'fetchUserProfile';
export const FETCH_ITEMS = 'fetchItems';
export const SET_ITEMS = 'setItems';

export function dispatchFetchUserItems(dispatch: Dispatch, what: CloudContent) {
  dispatch({
    type: `${USER_PROFILE}/${FETCH_ITEMS}`,
    what,
  });
}

export function dispatchFetchUserProfile(dispatch: Dispatch, userId: string) {
  dispatch({
    type: `${USER_PROFILE}/${FETCH_USER_PROFILE}`,
    payload: userId,
  });
}

export interface UserProfile {
  readonly uid: string;
  readonly name: string;
  readonly pro: boolean;
  readonly tags?: {
    key: string;
    label: string;
  }[];
}

export interface UserProfileModelState {
  userProfile?: UserProfile;
  userPhotos?: Photo[];
  userPosts?: Post[];
  userLinks?: Link[];
  userCoils?: Coil[];
  userLiquids?: Liquid[];
}

export interface UserProfileModelType {
  namespace: string;
  state: UserProfileModelState;
  effects: {
    [FETCH_USER_PROFILE]: Effect;
    [FETCH_ITEMS]: Effect;
  };
  reducers: {
    [SET_USER_PROFILE]: Reducer<UserProfileModelState>;
    [SET_ITEMS]: Reducer<UserProfileModelState>;
  };
  subscriptions: {};
}

const UserProfileModel: UserProfileModelType = {
  namespace: USER_PROFILE,
  state: {},
  effects: {
    *[FETCH_USER_PROFILE]({ payload: userId }, { put, call }) {
      const user: User | null = yield call(getUser, userId);
      if (!user) {
        yield put(routerRedux.replace({ pathname: '/404' }));
        return;
      }

      const newUser = {
        ...user,
        uid: userId,
      };
      yield put({ type: SET_USER_PROFILE, user: newUser });
    },
    *[FETCH_ITEMS]({ what }, { put, call, select }) {
      const uid = yield select((state: ConnectState) => state.userProfile.userProfile?.uid);
      if (!uid) {
        return;
      }

      let items;
      switch (what as CloudContent) {
        case CloudContent.PHOTOS:
          items = yield call(getUserPhotos, uid);
          break;
        case CloudContent.POSTS:
          items = yield call(getUserPosts, uid);
          break;
        case CloudContent.LINKS:
          items = yield call(getUserLinks, uid);
          break;
        case CloudContent.COILS:
          items = yield call(getUserCoils, uid);
          break;
        case CloudContent.LIQUIDS:
          items = yield call(getUserLiquids, uid);
          break;
        default:
          throw new Error(`Illegal type ${what}`);
      }

      yield put({
        type: SET_ITEMS,
        what,
        items: Array.isArray(items) ? items : [],
      });
    },
  },
  reducers: {
    [SET_USER_PROFILE](state, { user }) {
      const tags = [];
      // TODO test
      const isPro = user.subscription && moment(user.subscription).isAfter();
      if (isPro) {
        tags.push({ key: 'pro', label: 'Pro' });
      }

      return {
        ...state,
        userProfile: {
          uid: user.uid,
          name: user.display_name,
          pro: isPro,
          tags,
        },
      };
    },
    [SET_ITEMS](state, { what, items }): UserProfileModelState {
      return {
        ...state,
        userPhotos: what === CloudContent.PHOTOS ? items : state?.userPhotos,
        userPosts: what === CloudContent.POSTS ? items : state?.userPosts,
        userLinks: what === CloudContent.LINKS ? items : state?.userLinks,
        userCoils: what === CloudContent.COILS ? items : state?.userCoils,
        userLiquids: what === CloudContent.LIQUIDS ? items : state?.userLiquids,
      };
    },
  },
  subscriptions: {},
};

export default UserProfileModel;
