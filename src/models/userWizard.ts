import { history } from 'umi';
import { message } from 'antd';
import { updateDisplayName } from '@/services/user';
import { uploadAvatar } from '@/services/storage';
import { User } from '@vapetool/types';
import { useState } from 'react';

export interface UserWizardState {
  displayName?: string;
  avatarUrl?: string;
  newAvatarUrl?: string;
  newAvatarBlob?: string;
  showNewAvatarChooser?: boolean;
}

export default () => {
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [newAvatarBlob, setNewAvatarBlob] = useState<Blob | File | undefined>(undefined);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');
  const [showAvatarChooser, setShowAvatarChooser] = useState<boolean>(false);
  const updateUser = async (currentUser: User) => {
    if (!displayName) {
      message.error({ message: 'Can not save user with empty user name' });
      return;
    }
    if (displayName && displayName !== currentUser.display_name) {
      console.log(
        `Uploading new display name ${currentUser.display_name} to userid: ${currentUser.uid}`,
      );
      try {
        await updateDisplayName(currentUser.uid, displayName);
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
        await uploadAvatar(newAvatarBlob, currentUser.uid);
      } catch (e) {
        console.error(e);
        message.error({ message: `Upload new avatar failed ${e.message}` });
      }
    } else {
      console.info('Skipping updating uploadAvatar');
    }
    history.goBack();
  };
  const redirectBack = () => {
    history.goBack();
  };
  return {
    displayName,
    setDisplayName,
    newAvatarBlob,
    setNewAvatarBlob,
    newAvatarUrl,
    setNewAvatarUrl,
    showAvatarChooser,
    setShowAvatarChooser,
    updateUser,
    redirectBack,
  };
};
