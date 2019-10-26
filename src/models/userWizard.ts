import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { getUser, updateDisplayName } from '@/services/user';
import { ConnectState } from '@/models/connect';
import { uploadAvatar } from '@/services/storage';

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
    updateUser: Effect;
  };
  reducers: {
    setDisplayName: Reducer<UserWizardState>;
    setNewAvatar: Reducer<UserWizardState>;
    showNewAvatarChooser: Reducer<UserWizardState>;
    hideNewAvatarChooser: Reducer<UserWizardState>;
  };
}

const UserWizardModel: ModelType = {
  namespace: 'userWizard',

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
        type: 'user/setUser',
        currentUser: yield call(getUser, currentUser.uid),
      });
      yield put({ type: 'global/redirectBack' });
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
