import { Button, Card, Col, Input, Row, Spin } from 'antd';
import React from 'react';
import { FormattedMessage, useModel } from 'umi';
import ButtonGroup from 'antd/es/button/button-group';
import styles from '@/pages/user/profile/styles.less';
import FirebaseImage from '@/components/StorageAvatar';
import ImageChooser from '@/components/ImageChoser';
import { ImageType } from '@/services/storage';
import { SaveOutlined } from '@ant-design/icons';

const UserWizard: React.FC = () => {
  const {
    displayName,
    newAvatarUrl,
    showAvatarChooser,
    setDisplayName,
    setNewAvatarBlob,
    setNewAvatarUrl,
    setShowAvatarChooser,
    redirectBack,
    updateUser,
  } = useModel('userWizard');

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const onDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDisplayName(e.target.value);
  const onNewAvatarChoose = (imageUrl: string, imageBlob: Blob | File) => {
    setNewAvatarBlob(imageBlob);
    setNewAvatarUrl(imageUrl);
    setShowAvatarChooser(false);
  };

  if (!currentUser) {
    return <Spin />;
  }
  return (
    <div>
      <Row>
        <Col xs={0} md={4} lg={6} xl={8} />
        <Col xs={24} md={16} lg={14} xl={10}>
          <Card
            style={{ maxWidth: 500 }}
            title={<FormattedMessage id="user.setupUser" defaultMessage="Setup user" />}
          >
            <div className={styles.avatarHolder}>
              <div onClick={() => setShowAvatarChooser(true)}>
                <div style={{ textAlign: 'center' }}>
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
                <Button onClick={() => redirectBack()}>
                  <FormattedMessage id="misc.actions.cancel" defaultMessage="Cancel" />
                </Button>

                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  onClick={() => updateUser(currentUser)}
                >
                  <FormattedMessage id="misc.actions.save" defaultMessage="Save" />
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
        onCancel={() => setShowAvatarChooser(false)}
        onImageChoose={onNewAvatarChoose}
        maxSize={256}
      />
    </div>
  );
};

export default UserWizard;
