import { Button, Card } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import styles from '@/pages/user/center/Center.less';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

const UserWizard: React.FC<{
  currentUser: CurrentUser;
  displayName: string;
  dispatch: Dispatch;
}> = props => {
  const { displayName, currentUser, dispatch } = props;
  const onSave = () => {
    dispatch({
      type: 'userWizard/saveUser',
    });
  };

  return (
    <Card style={{ maxWidth: 500 }}>
      <div className={styles.avatarHolder}>
        <img alt="" src={currentUser.avatar} />
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
  );
};

export default connect(({ user, userWizard }: ConnectState) => ({
  currentUser: user.currentUser,
  displayName: userWizard.displayName,
}))(UserWizard);
