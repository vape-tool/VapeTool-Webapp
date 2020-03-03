import React from 'react';
import { Tag } from 'antd';
import styles from './styles.less';

interface UserCardProps {
  userTags: Array<{ key: string; label: string }>;
}

const UserTags: React.FC<UserCardProps> = ({ userTags }) => (
  <div className={styles.tags}>
    <span className={styles.tagsTitle}>Labels:</span>
    {userTags.map(item => (
      <Tag key={item.key}>{item.label}</Tag>
    ))}
  </div>
);

export default UserTags;
