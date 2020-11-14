import LoginRegisterTemplate from '@/components/LoginRegisterTemplate';
import React from 'react';
import SkipAnonymously from '../login/anonymous';
import LoginEmail from '../login/email';
import LoginFacebook from '../login/facebook';
import LoginGoogle from '../login/google';

const Login: React.FC<{}> = () => {
  return (
    <LoginRegisterTemplate>
      <LoginGoogle register />
      <LoginFacebook register />
      <SkipAnonymously />
      <LoginEmail register />
    </LoginRegisterTemplate>
  );
};

export default Login;
