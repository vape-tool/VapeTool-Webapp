import React from 'react';
import LoginEmail from './email';
import LoginGoogle from './google';
import LoginRegisterTemplate from '../../components/LoginRegisterTemplate';
import LoginFacebook from './facebook';
import SkipAnonymously from './anonymous';

const Login: React.FC = () => {
  return (
    <LoginRegisterTemplate>
      <LoginGoogle />
      <LoginFacebook />
      <SkipAnonymously />
      <LoginEmail />
    </LoginRegisterTemplate>
  );
};

export default Login;
