import { Button, Card, Col, Input, Row, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import styles from '@/pages/user/profile/styles.less';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import FirebaseImage from '@/components/StorageAvatar';
import ImageChooser from '@/components/ImageChoser';
import {
  dispatchNewAvatar,
  dispatchNewDisplayName,
  dispatchUpdateUser,
  hideNewAvatarChooser,
  showNewAvatarChooser,
} from '@/models/userWizard';
import { redirectBack } from '@/models/global';
import { ImageType } from '@/services/storage';
import { SaveOutlined } from '@ant-design/icons';

const UserWizard: React.FC<{
  currentUser?: CurrentUser;
  displayName?: string;
  newAvatarUrl?: string;
  showAvatarChooser?: boolean;
  dispatch: Dispatch;
}> = props => {
  const { displayName, currentUser, dispatch, newAvatarUrl, showAvatarChooser } = props;
  const onDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatchNewDisplayName(dispatch, e.target.value);
  const onNewAvatarChoose = (imageUrl: string, imageBlob: Blob | File) =>
    dispatchNewAvatar(dispatch, imageUrl, imageBlob);

  if (!currentUser) {
    return <Spin />;
  }
  return (
    <div>
      <Row>
        <Col xs={0} md={4} lg={6} xl={8} />
        <Col xs={24} md={16} lg={14} xl={10}>
          <Card style={{ maxWidth: 500 }} title="Setup user">
            <div className={styles.avatarHolder}>
              <div onClick={() => showNewAvatarChooser(dispatch)}>
                <div>
                  {newAvatarUrl && <img alt="avatar" src={newAvatarUrl} width={200} />}
                  {!newAvatarUrl && (
                    <FirebaseImage
                      type={ImageType.USER}
                      id={currentUser.uid}
                      size={200}
                      shape="square"
                    />
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
                  value={displayName}
                />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <ButtonGroup>
                <Button onClick={() => redirectBack(dispatch)}>Cancel</Button>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  onClick={() => dispatchUpdateUser(dispatch)}
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
          </Card>
        </Col>
        <Col xs={0} md={4} lg={6} xl={8} />
      </Row>
      <ImageChooser
        uploadHintText="Upload avatar photo. Make sure that the photo doesn't brake the rules."
        visible={showAvatarChooser || false}
        onCancel={() => hideNewAvatarChooser(dispatch)}
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
