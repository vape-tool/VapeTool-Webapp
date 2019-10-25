import { Avatar, Button, Card, Icon, message, Upload } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import styles from '@/pages/user/center/Center.less';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import FirebaseImage from '@/components/StorageAvatar';

const UserWizard: React.FC<{
  currentUser: CurrentUser;
  displayName: string;
  newImageUrl: string;
  dispatch: Dispatch;
}> = props => {
  const { displayName, currentUser, dispatch, newImageUrl } = props;
  const onSave = () => {
    dispatch({
      type: 'userWizard/saveUser',
    });
  };
  const onEditAvatar = () => {
    dispatch({
      type: 'userWizard/showEditAvatar',
    });
  };

  const getBase64 = (originFileObj: any, callback: (imageUrl: any) => any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(originFileObj);
  };

  const onAvatarLoaded = (file: UploadFile) => {
    getBase64(file.originFileObj, imageUrl =>
      dispatch({
        type: 'userWizard/setNewImageUrl',
        newImageUrl: imageUrl,
      }),
    );
  };

  const onFileChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      onAvatarLoaded(info.file);
      // Get this url from response in real world.
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <Card style={{ maxWidth: 500 }} title="Setup user">
        <div className={styles.avatarHolder}>
          <Upload onChange={onFileChange} showUploadList={false}>
            <div onClick={onEditAvatar} style={{ display: 'grid' }}>
              {newImageUrl && (
                <Avatar
                  src={newImageUrl}
                  size={200}
                  shape="square"
                  style={{ gridColumn: 1, gridRow: 1 }}
                />
              )}
              {!newImageUrl && (
                <FirebaseImage type="user" id={currentUser.uid} size={200} shape="square" />
              )}
              <Icon type="upload" style={{ gridColumn: 1, gridRow: 1, position: 'absolute' }} />
            </div>
          </Upload>
          <div
            className={styles.name}
            style={{
              boxSizing: 'inherit',
              display: 'block',
            }}
          >
            <span
              style={{
                display: 'block',
                outline: 0,
                wordWrap: 'break-word',
                boxSizing: 'inherit',
                cursor: 'text',
                minHeight: 35,
                lineHeight: '37px',
                fontSize: 28,
                fontFamily: 'Proxima Nova Bold,Helvetica Neue,Helvetica,Arial,sans-serif',
              }}
              contentEditable
              spellCheck={false}
              placeholder={currentUser.name}
            >
              {displayName || currentUser.name}
            </span>
          </div>
          <div>{currentUser.signature}</div>
        </div>
        <Button icon="save" onClick={onSave}>
          Save
        </Button>
      </Card>
    </div>
  );
};

export default connect(({ user, userWizard }: ConnectState) => ({
  currentUser: user.currentUser,
  displayName: userWizard.displayName,
  newImageUrl: userWizard.newImageUrl,
}))(UserWizard);
