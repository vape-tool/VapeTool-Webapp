import { Dispatch, Reducer, Effect, history  } from 'umi';
import { User } from '@vapetool/types';
import { getUser } from '@/services/user';
import { Coil, Item, ItemName, Link, Liquid, Photo, Post } from '@/types';
import { ConnectState } from '@/models/connect';
import {
  getUserCoils,
  getUserLinks,
  getUserLiquids,
  getUserPhotos,
  getUserPosts,
} from '@/services/userCenter';
import { isProUser } from '@/pages/login/utils/utils';

export const USER_PROFILE = 'userProfile';
export const SET_USER_PROFILE = 'setUserProfile';
export const FETCH_USER_PROFILE = 'fetchUserProfile';
export const FETCH_ITEMS = 'fetchItems';
export const SET_ITEMS = 'setItems';

export function dispatchFetchUserItems(dispatch: Dispatch, what: ItemName) {
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

export function dispatchSetUserItems<T extends Item>(
  dispatch: Dispatch,
  what: ItemName,
  items: T[],
) {
  dispatch({
    type: `${USER_PROFILE}/${SET_ITEMS}`,
    what,
    items,
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
        yield put(history.routerRedux.replace({ pathname: '/404' }));
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
      switch (what as ItemName) {
        case ItemName.PHOTO:
          items = yield call(getUserPhotos, uid);
          break;
        case ItemName.POST:
          items = yield call(getUserPosts, uid);
          break;
        case ItemName.LINK:
          items = yield call(getUserLinks, uid);
          break;
        case ItemName.COIL:
          items = yield call(getUserCoils, uid);
          break;
        case ItemName.LIQUID:
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
      const isPro = isProUser(user);
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
        userPhotos: what === ItemName.PHOTO ? items : state?.userPhotos,
        userPosts: what === ItemName.POST ? items : state?.userPosts,
        userLinks: what === ItemName.LINK ? items : state?.userLinks,
        userCoils: what === ItemName.COIL ? items : state?.userCoils,
        userLiquids: what === ItemName.LIQUID ? items : state?.userLiquids,
      };
    },
  },
  subscriptions: {},
};

export default UserProfileModel;
