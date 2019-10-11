import { notification } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StyledFirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';
import { StateType } from './model';
import styles from './style.less';
import { auth } from '@/utils/firebase';

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}

interface LoginState {
  type: string;
  autoLogin: boolean;
}

export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/successLogin'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (): boolean => {
        notification.info({ message: 'User logged in' });
        const { dispatch } = this.props;
        dispatch({
          type: 'userLogin/successLogin',
        });

        return false;
      },
    },
  };

  render() {
    return (
      <div className={styles.main}>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
}

export default Login;
