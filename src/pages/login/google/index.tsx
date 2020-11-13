import React from 'react';
import { Button, message } from 'antd';
import { history, useModel } from 'umi';
import { GoogleOutlined } from '@ant-design/icons';
import { signInViaGoogle } from '@/services/user';

export default function LoginGoogle({ register }: { register?: boolean }) {
  const initialState = useModel('@@initialState');
  const handleSubmit = async () => {
    try {
      const credentials = await signInViaGoogle();
      if (!credentials.user) throw new Error('Current user not defined');
      message.info('User logged in');
      history.replace('/');
      initialState.refresh();
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <Button onClick={handleSubmit} icon={<GoogleOutlined />} block style={{ marginBottom: 10 }}>
      {register ? 'Register' : 'Sign in'} with Google
    </Button>
  );
}
