import React from 'react';
import styles from '@/components/ItemView/styles.less';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';

export const LikeIconText = ({
  text,
  onClick,
  likedByMe,
}: {
  text: string;
  onClick: any;
  likedByMe?: boolean;
}) => (
  <span onClick={onClick}>
    {likedByMe ? (
      <LikeFilled className={likedByMe ? styles.liked : ''} style={{ marginRight: 8 }} />
    ) : (
      <LikeOutlined className={likedByMe ? styles.liked : ''} style={{ marginRight: 8 }} />
    )}
    {text}
  </span>
);
