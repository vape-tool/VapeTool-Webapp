import { notification } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StyledFirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { StateType } from './model';
import styles from './style.less';
import { auth } from '@/utils/firebase';

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
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
class Login extends Component<LoginProps> {
  // eslint-disable-next-line react/sort-comp
  signInSuccessWithAuthResult = (): boolean => {
    notification.info({ message: 'User logged in' });
    const { dispatch } = this.props;
    dispatch({
      type: 'userLogin/successLogin',
    });

    return false;
  };

  uiConfig: firebaseui.auth.Config = {
    signInFlow: 'redirect',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
    },
  };

  responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response);
    if (response.hasOwnProperty('error')) {
      notification.error({ message: response['error'] });
    } else if (response.hasOwnProperty('code')) {
      const res = response as GoogleLoginResponseOffline;
      console.log(`responseGoogle offline code: ${res.code}`)
    } else {
      const res = response as GoogleLoginResponse;
      const accessToken = res.getAuthResponse().access_token;
      const idToken = res.getAuthResponse().id_token;
      const credentials = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      auth.signInWithCredential(credentials).then(this.signInSuccessWithAuthResult)
    }
  };

  render() {
    return (
      <div className={styles.main}>
        <GoogleLogin
          clientId="526012004991-p594on1n90qhp04qgtamgp3pjlpo7rsi.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          uxMode="redirect"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy="single_host_origin"
        />
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
      </div>
    );
  }
}

export default Login;
