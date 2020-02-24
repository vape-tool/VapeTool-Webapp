import { Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser, dispatchLogout } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import FirebaseImage from '@/components/StorageAvatar';
import { ImageType } from '@/services/storage';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = props => {
  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      dispatchLogout(props.dispatch!);
      return;
    }
    router.push(`/user/${key}`);
  };

  const { menu } = props;
  const currentUser = props.currentUser ? props.currentUser : { uid: '', name: '' };
  if (!menu) {
    return currentUser && currentUser.name && currentUser.uid ? (
      <span className={`${styles.action} ${styles.account}`}>
        <FirebaseImage
          size="small"
          type={ImageType.USER}
          id={currentUser.uid}
          className={styles.avatar}
          alt="avatar"
        />
        <span className={styles.name}>{currentUser.name}</span>
      </span>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="logout">
        <Icon type="logout" />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );

  return currentUser && currentUser.name && currentUser.uid ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <FirebaseImage
          size="small"
          type={ImageType.USER}
          id={currentUser.uid}
          className={styles.avatar}
          alt="avatar"
        />
        <span className={styles.name}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
