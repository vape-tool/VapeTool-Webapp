import { Icon } from 'antd';
import React from 'react';
import styles from '@/components/PhotoView/index.less';

export const LikeIconText =
  ({
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
    <span>
        <Icon
          onClick={onClick}
          type={type}
          theme={likedByMe ? 'filled' : 'outlined'}
          className={likedByMe ? styles.liked : ''}
          style={{ marginRight: 8 }}
        />
      {text}
      </span>
  );
