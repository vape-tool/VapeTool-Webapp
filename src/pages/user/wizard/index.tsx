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
import ButtonGroup from 'antd/es/button/button-group';

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
    // TODO Resize image to 300x300 or so
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
              <div style={{ gridColumn: 1, gridRow: 1 }}>
                {newImageUrl && <Avatar src={newImageUrl} size={200} shape="square" />}
                {!newImageUrl && (
                  <FirebaseImage type="user" id={currentUser.uid} size={200} shape="square" />
                )}
              </div>
              <Icon
                type="upload"
                style={{ gridColumn: 1, gridRow: 1, zIndex: 1, textAlign: 'right', fontSize: 20 }}
              />
            </div>
          </Upload>
          <br />
          <div className={styles.name}>
            <span
              style={{
                paddingTop: 20,
                display: 'block',
                outline: 0,
                wordWrap: 'break-word',
                boxSizing: 'inherit',
                cursor: 'text',
                minHeight: 35,
                lineHeight: '37px',
                fontSize: 28,
                fontFamily: 'Proxima Nova Bold,Helvetica Neue,Helvetica,Arial,sans-serif',
                borderBottom: '1px solid',
                borderColor: '#CCC',
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
        <div style={{ textAlign: 'right' }}>
          <ButtonGroup>
            <Button onClick={onSave}>Cancel</Button>
            <Button icon="save" type="primary" onClick={onSave}>
              Save
            </Button>
          </ButtonGroup>
        </div>
      </Card>
    </div>
  );
};

export default connect(({ user, userWizard }: ConnectState) => ({
  currentUser: user.currentUser,
  displayName: userWizard.displayName,
  newImageUrl: userWizard.newImageUrl,
}))(UserWizard);
