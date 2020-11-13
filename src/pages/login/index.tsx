import React from 'react';
import LoginEmail from './email';
import LoginGoogle from './google';
import LoginRegisterTemplate from '../../components/LoginRegisterTemplate';

const Login: React.FC = () => {
  return (
    <LoginRegisterTemplate>
      <LoginGoogle />
      <LoginEmail />
    </LoginRegisterTemplate>
  );
};

export default Login;
