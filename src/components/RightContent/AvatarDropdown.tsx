import React, { useCallback } from 'react';
import { LogoutOutlined, UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { Menu, message, Spin } from 'antd';
import { history, useModel, FormattedMessage } from 'umi';
import { stringify } from 'querystring';
import { ImageType } from '@/services/storage';
import { getPaymentUrl, getUserLoginUrl, getUserProfileUrl } from '@/places/user.places';
import { logoutFirebase } from '@/services/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import FirebaseImage from '../StorageAvatar';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = () => {
  if (window.location.pathname !== getUserLoginUrl()) {
    history.replace({
      pathname: getUserLoginUrl(),
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
};

const loading = (
  <span className={`${styles.action} ${styles.account}`}>
    <Spin
      size="small"
      style={{
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  </span>
);

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(async (event: any) => {
    const { key } = event;
    if (key === 'logout') {
      await logoutFirebase();
      setInitialState({ ...initialState, currentUser: undefined, firebaseUser: undefined });
      loginOut();
      return;
    }
    if (key === 'profile') {
      if (!initialState?.firebaseUser?.uid) {
        message.error("Couldn't retreive current user");
        return;
      }
      history.push({
        pathname: getUserProfileUrl(initialState.firebaseUser.uid),
      });
      return;
    }
    if (key === 'unlockPro') {
      history.replace({
        pathname: getPaymentUrl(),
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
  }, []);

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }
  // TODO show unlockPro only when !isPro(currentUser) is false
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {currentUser && (
        <Menu.Item key="profile">
          <UserOutlined />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
      )}
      {currentUser && (
        <Menu.Item key="unlockPro">
          <UnlockOutlined />
          <FormattedMessage id="menu.account.unlock-pro" defaultMessage="unlock pro" />
        </Menu.Item>
      )}
      {currentUser && <Menu.Divider />}
      <Menu.Item key="logout">
        <LogoutOutlined />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <FirebaseImage
          size="small"
          type={ImageType.USER}
          id={currentUser.uid}
          className={styles.avatar}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
