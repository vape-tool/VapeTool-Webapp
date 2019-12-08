import { Icon } from 'antd';
import React from 'react';

export const CommentIconText = ({
  type,
  text,
  onClick,
}: {
  type: string;
  text: string;
  onClick: any;
}) => (
  <span onClick={onClick}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
