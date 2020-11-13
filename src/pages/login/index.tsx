import React from 'react';
import LoginEmail from './email';
import LoginGoogle from './google';
import LoginRegisterTemplate from '../../components/LoginRegisterTemplate';
import LoginFacebook from './facebook';

const Login: React.FC = () => {
  return (
    <LoginRegisterTemplate>
      <LoginGoogle />
      <LoginFacebook />
      <LoginEmail />
    </LoginRegisterTemplate>
  );
};

export default Login;
