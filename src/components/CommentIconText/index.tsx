import { Icon } from 'antd';
import React from 'react';

export const CommentIconText = (
  {
    type,
    text,
    onClick,
  }: {
    type: string;
    text: string;
    onClick: any;
  }) => (
  <span>
        <Icon onClick={onClick} type={type} style={{ marginRight: 8 }}/>
    {text}
      </span>
);
