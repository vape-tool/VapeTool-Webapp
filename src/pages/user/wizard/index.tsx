import { Button, Card, Input, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import styles from '@/pages/user/center/Center.less';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import FirebaseImage from '@/components/StorageAvatar';
import ImageChooser from '@/components/ImageChoser';

const UserWizard: React.FC<{
  currentUser?: CurrentUser;
  displayName?: string;
  newAvatarUrl?: string;
  showAvatarChooser: boolean;
  dispatch: Dispatch;
}> = props => {
  const { displayName, currentUser, dispatch, newAvatarUrl, showAvatarChooser } = props;
  const onSave = () => dispatch({ type: 'userWizard/updateUser' });
  const onCancel = () => dispatch({ type: 'global/redirectBack' });
  const showNewAvatarChooser = () => dispatch({ type: 'userWizard/showNewAvatarChooser' });
  const hideNewAvatarChooser = () => dispatch({ type: 'userWizard/hideNewAvatarChooser' });
  const onDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'userWizard/setDisplayName', displayName: e.target.value });
  const onNewAvatarChoose = (imageUrl: string, imageBlob: Blob | File) =>
    dispatch({ type: 'userWizard/setNewAvatar', imageUrl, imageBlob });

  if (!currentUser) {
    return <Spin />;
  }
  return (
    <div>
      <Card style={{ maxWidth: 500 }} title="Setup user">
        <div className={styles.avatarHolder}>
          <div onClick={showNewAvatarChooser}>
            <div>
              {newAvatarUrl && <img alt="avatar" src={newAvatarUrl} width={200} />}
              {!newAvatarUrl && (
                <FirebaseImage type="user" id={currentUser.uid} size={200} shape="square" />
              )}
            </div>
          </div>
          <br />
          <div className={styles.name}>
            <Input
              style={{
                textAlign: 'center',
                display: 'block',
                outline: 0,
                wordWrap: 'break-word',
                boxSizing: 'inherit',
                cursor: 'text',
                minHeight: 50,
                lineHeight: '37px',
                fontSize: 28,
                fontFamily: 'Proxima Nova Bold,Helvetica Neue,Helvetica,Arial,sans-serif',
              }}
              placeholder={currentUser.name}
              onChange={onDisplayNameChange}
              value={displayName || currentUser.name}
            />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <ButtonGroup>
            <Button onClick={onCancel}>Cancel</Button>
            <Button icon="save" type="primary" onClick={onSave}>
              Save
            </Button>
          </ButtonGroup>
        </div>
      </Card>
      <ImageChooser
        uploadHintText="Upload avatar photo. Make sure that the photo doesn't brake the rules."
        visible={showAvatarChooser}
        onCancel={hideNewAvatarChooser}
        onImageChoose={onNewAvatarChoose}
        maxSize={256}
      />
    </div>
  );
};

export default connect(({ user, userWizard }: ConnectState) => ({
  currentUser: user.currentUser,
  displayName: userWizard.displayName,
  newAvatarUrl: userWizard.newAvatarUrl,
  showAvatarChooser: userWizard.showNewAvatarChooser,
}))(UserWizard);
