import React from 'react';
import { MessageOutlined } from '@ant-design/icons';

export const CommentIconText = ({ text, onClick }: { text: string; onClick: any }) => (
  <span onClick={onClick}>
    <MessageOutlined style={{ marginRight: 8 }} />
    {text}
  </span>
);
