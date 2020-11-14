import React from 'react';
import { Button, message } from 'antd';
import { history, useModel } from 'umi';
import { LoginOutlined } from '@ant-design/icons';
import { signInAnonymously } from '@/services/user';

export default function SkipAnonymously() {
  const initialState = useModel('@@initialState');
  const handleSubmit = async () => {
    try {
      const credentials = await signInAnonymously();
      if (!credentials.user) throw new Error('Current user not defined');
      message.info('User logged in');
      history.replace('/');
      initialState.refresh();
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <Button onClick={handleSubmit} icon={<LoginOutlined />} block style={{ marginBottom: 10 }}>
      Skip as anonymous
    </Button>
  );
}
