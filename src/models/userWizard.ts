import { Effect } from 'dva';
import { Dispatch, Reducer } from 'redux';
import { message } from 'antd';
import { getUser, updateDisplayName } from '@/services/user';
import { ConnectState } from '@/models/connect';
import { uploadAvatar } from '@/services/storage';
import { GLOBAL, REDIRECT_BACK } from './global';
import { SET_USER, USER } from '@/models/user';

export const USER_WIZARD = 'userWizard';
export const UPDATE_USER = 'updateUser';
export const SET_DISPLAY_NAME = 'setDisplayName';
export const SET_NEW_AVATAR = 'setNewAvatar';
export const SHOW_NEW_AVATAR_CHOOSER = 'showNewAvatarChooser';
export const HIDE_NEW_AVATAR_CHOOSER = 'hideNewAvatarChooser';

export function dispatchUpdateUser(dispatch: Dispatch) {
  dispatch({
    type: `${USER_WIZARD}/${UPDATE_USER}`,
  });
}

export function showNewAvatarChooser(dispatch: Dispatch) {
  dispatch({
    type: `${USER_WIZARD}/${SHOW_NEW_AVATAR_CHOOSER}`,
  });
}

export function hideNewAvatarChooser(dispatch: Dispatch) {
  dispatch({
    type: `${USER_WIZARD}/${HIDE_NEW_AVATAR_CHOOSER}`,
  });
}

export function dispatchNewDisplayName(dispatch: Dispatch, displayName: string) {
  dispatch({
    type: `${USER_WIZARD}/${SET_DISPLAY_NAME}`,
    displayName,
  });
}

export function dispatchNewAvatar(dispatch: Dispatch, imageUrl: string, imageBlob: Blob | File) {
  dispatch({
    type: `${USER_WIZARD}/${SET_NEW_AVATAR}`,
    imageUrl,
    imageBlob,
  });
}

export interface UserWizardState {
  displayName?: string;
  avatarUrl?: string;
  newAvatarUrl?: string;
  newAvatarBlob?: string;
  showNewAvatarChooser?: boolean;
}

export interface ModelType {
  namespace: string;
  state: UserWizardState;
  effects: {
    [UPDATE_USER]: Effect;
  };
  reducers: {
    [SET_DISPLAY_NAME]: Reducer<UserWizardState>;
    [SET_NEW_AVATAR]: Reducer<UserWizardState>;
    [SHOW_NEW_AVATAR_CHOOSER]: Reducer<UserWizardState>;
    [HIDE_NEW_AVATAR_CHOOSER]: Reducer<UserWizardState>;
  };
}

const UserWizardModel: ModelType = {
  namespace: USER_WIZARD,

  state: {},

  effects: {
    *updateUser(_, { put, call, select }) {
      const currentUser = yield select((state: ConnectState) => state.user.currentUser);
      const { displayName, newAvatarBlob } = yield select((state: ConnectState) =>
        Object.create({
          displayName: state.userWizard.displayName,
          newAvatarBlob: state.userWizard.newAvatarBlob,
        }),
      );

      if (!displayName && !currentUser.name) {
        message.error({ message: 'Can not save user with empty user name' });
        return;
      }
      if (displayName && displayName !== currentUser.name) {
        console.log(`Uploading new display name ${currentUser.name} to userid: ${currentUser.uid}`);
        try {
          yield call(updateDisplayName, currentUser.uid, displayName);
        } catch (e) {
          console.error(e);
          message.error({ message: `Update user name failed. ${e.message}` });
        }
      } else {
        console.info('Skipping updating displayName');
      }

      if (newAvatarBlob) {
        console.log(`Uploading new Avatar ${newAvatarBlob} to userid: ${currentUser.uid}`);
        try {
          yield call(uploadAvatar, newAvatarBlob, currentUser.uid);
        } catch (e) {
          console.error(e);
          message.error({ message: `Upload new avatar failed ${e.message}` });
        }
      } else {
        console.info('Skipping updating uploadAvatar');
      }

      yield put({
        type: `${USER}/${SET_USER}`,
        currentUser: yield call(getUser, currentUser.uid),
      });
      yield put({ type: `${GLOBAL}/${REDIRECT_BACK}` });
    },
  },
  reducers: {
    setDisplayName(state, { displayName }) {
      return {
        ...state,
        displayName,
      };
    },
    setNewAvatar(state, { imageUrl, imageBlob }) {
      return {
        ...state,
        showNewAvatarChooser: false,
        newAvatarUrl: imageUrl,
        newAvatarBlob: imageBlob,
      };
    },
    showNewAvatarChooser(state) {
      return {
        ...state,
        showNewAvatarChooser: true,
      };
    },
    hideNewAvatarChooser(state) {
      return {
        ...state,
        showNewAvatarChooser: false,
      };
    },
  },
};

export default UserWizardModel;
