import LoginRegisterTemplate from '@/components/LoginRegisterTemplate';
import React from 'react';
import LoginEmail from '../login/email';
import LoginFacebook from '../login/facebook';
import LoginGoogle from '../login/google';

const Login: React.FC<{}> = () => {
  return (
    <LoginRegisterTemplate>
      <LoginGoogle register />
      <LoginEmail register />
      <LoginFacebook register />
    </LoginRegisterTemplate>
  );
};

export default Login;
