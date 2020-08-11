import React, { useCallback } from 'react';
import { LogoutOutlined, UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { history, useModel, FormattedMessage } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'querystring';
import { ImageType } from '@/services/storage';
import { getCurrentUserProfileUrl, getPaymentUrl, getUserLoginUrl } from '@/places/user.places';
import { logoutFirebase } from '@/services/user';
import { verifyCurrentUserWithRedirect } from '@/services';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import FirebaseImage from '../StorageAvatar';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await logoutFirebase();
  const { redirect } = getPageQuery();
  // Note: There may be security issues, please note
  if (window.location.pathname !== getUserLoginUrl() && !redirect) {
    history.replace({
      pathname: getUserLoginUrl(),
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
};

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback((event: ClickParam) => {
    const { key } = event;
    if (key === 'logout') {
      setInitialState({ ...initialState, currentUser: undefined });
      loginOut();
      return;
    }
    if (key === 'profile') {
      if (!verifyCurrentUserWithRedirect()) return;
      history.replace({
        pathname: getCurrentUserProfileUrl(),
        search: stringify({
          redirect: window.location.href,
        }),
      });
      return;
    }
    if (key === 'unlockPro') {
      if (!verifyCurrentUserWithRedirect()) return;
      history.replace({
        pathname: getPaymentUrl(),
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
  }, []);

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
