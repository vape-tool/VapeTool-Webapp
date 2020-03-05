import { Icon } from 'antd';
import React from 'react';
import styles from '@/components/ItemView/styles.less';

export const LikeIconText = ({
  type,
  text,
  onClick,
  likedByMe,
}: {
  type: string;
  text: string;
  onClick: any;
  likedByMe?: boolean;
}) => (
  <span onClick={onClick}>
    <Icon
      type={type}
      theme={likedByMe ? 'filled' : 'outlined'}
      className={likedByMe ? styles.liked : ''}
      style={{ marginRight: 8 }}
    />
    {text}
  </span>
);
