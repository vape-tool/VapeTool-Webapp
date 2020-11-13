import React from 'react';
import { Button, message } from 'antd';
import { history, useModel } from 'umi';
import { FacebookOutlined } from '@ant-design/icons';
import { signInViaFacebook } from '@/services/user';

export default function LoginFacebook({ register }: { register?: boolean }) {
  const initialState = useModel('@@initialState');
  const handleSubmit = async () => {
    try {
      const credentials = await signInViaFacebook();
      if (!credentials.user) throw new Error('Current user not defined');
      message.info('User logged in');
      history.replace('/welcome');
      initialState.refresh();
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <Button onClick={handleSubmit} icon={<FacebookOutlined />} block style={{ marginBottom: 10 }}>
      {register ? 'Register' : 'Sign in'} with Facebook
    </Button>
  );
}
