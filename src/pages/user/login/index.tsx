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
import { getPageFragment } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';

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
  redirectingFromProvider = false;


  componentDidMount(): void {
    const query = getPageFragment();
    console.log('componentDidMount');
    console.log(query);
    if (query && query.id_token) {
      this.redirectingFromProvider = true;
      console.log(`query.id_token: ${query.id_token}`);
      const credentials = firebase.auth.GoogleAuthProvider.credential(query.id_token);
      auth.signInWithCredential(credentials).then(this.signInSuccessWithAuthResult).then(() => {
        console.log('DONE Successfully redirected')
      })
    }
  }

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
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
    },
  };

  responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response);
    if (response.hasOwnProperty('error')) {
      notification.error({ message: response.error });
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

  onFacebookClick = () => {

  };

  onFacebookCallback = (userInfo: ReactFacebookLoginInfo) => {
    console.log('onFacebookCallback');
    console.log(userInfo.accessToken);
    const credentials = firebase.auth.FacebookAuthProvider.credential(userInfo.accessToken);
    auth.signInWithCredential(credentials).then(this.signInSuccessWithAuthResult);
  };

  render() {
    // TODO seems to doesnt work
    if (this.redirectingFromProvider) {
      return <PageLoading/>;
    }
    // TODO remove react-google-login and implement it by hand
    return (
      <div className={styles.main}>
        <GoogleLogin
          className={styles.providerButton}
          style={{ margin: '24px', padding: '24px' }}
          clientId="526012004991-p594on1n90qhp04qgtamgp3pjlpo7rsi.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          uxMode="redirect"
          responseType="id_token permission token"
          scope="openid email profile"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy="single_host_origin"
        />
        <FacebookLogin
          appId="647403118692702"
          fields="name,email,picture"
          onClick={this.onFacebookClick}
          callback={this.onFacebookCallback}/>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
      </div>
    );
  }
}

export default Login;
