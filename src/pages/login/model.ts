import { AnyAction, Dispatch, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { User, UserPermission } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { isProUser, setAuthority } from './utils/utils';
import { auth } from '@/utils/firebase';
import { getUser, initializeUser } from '@/services/user';
import { GLOBAL, REDIRECT_BACK } from '@/models/global';
import { SET_USER, USER as USER_NAMESPACE } from '@/models/user';
import { getCurrentUserEditProfileUrl } from '@/places/user.places';

export const USER_LOGIN = 'userLogin';
export const CHANGE_LOGIN_STATUS = 'changeLoginStatus';
export const SUCCESS_LOGIN = 'successLogin';

export enum UserAuthorities {
  GUEST = 'guest',
  USER = 'user',
  PRO = 'pro',
  MDOERATOR = 'moderator',
  ADMIN = 'admin',
}

export function dispatchSuccessLogin(dispatch: Dispatch) {
  dispatch({
    type: `${USER_LOGIN}/${SUCCESS_LOGIN}`,
  });
}

export interface UserLoginModelState {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: UserAuthorities;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: UserLoginModelState) => T) => T },
) => void;

export interface UserLoginModelType {
  namespace: string;
  state: UserLoginModelState;
  effects: {
    [SUCCESS_LOGIN]: Effect;
  };
  reducers: {
    [CHANGE_LOGIN_STATUS]: Reducer<UserLoginModelState>;
  };
}

export const userPermissionToAuthority = (
  permission: UserPermission = UserPermission.ONLINE_USER,
  isPro: boolean = false,
): string[] => {
  const userRoles = [UserAuthorities.USER];
  if (isPro) {
    userRoles.push(UserAuthorities.PRO);
  }

  if (permission === undefined) {
    return userRoles;
  }

  switch (permission) {
    case UserPermission.ONLINE_MODERATOR:
      return [...userRoles, UserAuthorities.MDOERATOR];
    case UserPermission.ONLINE_ADMIN:
      return [...userRoles, UserAuthorities.ADMIN];
    case UserPermission.ONLINE_USER:
    case UserPermission.ONLINE_PRO_BUILDER: // do not respect user permission (it's Android only) -> check subscription as for all users
    default:
      return userRoles;
  }
};

const Model: UserLoginModelType = {
  namespace: USER_LOGIN,

  state: {
    status: undefined,
  },

  effects: {
    // TODO try to unify with fetchCurrent
    *[SUCCESS_LOGIN](_, { put, call }) {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        // It should never happen
        throw new Error('Success login with null firebaseUser');
      }
      const callUser = call(getUser, firebaseUser.uid);
      let user: User | null = yield callUser as User;
      if (user === null) {
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
        type: `${USER_NAMESPACE}/${SET_USER}`,
        currentUser,
      });

      yield put({
        type: `${USER_LOGIN}/${CHANGE_LOGIN_STATUS}`,
        currentAuthority: userPermissionToAuthority(user?.permission, isProUser(user)),
        status: 'ok',
      });
    },
  },

  reducers: {
    [CHANGE_LOGIN_STATUS](state, { currentAuthority, status }) {
      console.log('set authority', currentAuthority);
      setAuthority(currentAuthority);
      return {
        ...state,
        status,
      };
    },
  },
};

export default Model;
