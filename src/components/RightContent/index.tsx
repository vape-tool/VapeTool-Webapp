import { Tag, Space, Typography } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import { logoutFirebaseWithRedirect } from '@/services/user';
import { IS_NOT_PRODUCTION } from '@/utils/utils';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      {!initialState.firebaseUser?.isAnonymous ? (
        <Avatar />
      ) : (
        <a onClick={() => logoutFirebaseWithRedirect()}>
          <Typography style={{ color: 'white' }}>Log in</Typography>
        </a>
      )}
      {IS_NOT_PRODUCTION && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
