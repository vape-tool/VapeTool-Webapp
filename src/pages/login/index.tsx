import { notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { routerRedux } from 'dva/router';
import { SUCCESS_LOGIN, USER_LOGIN, UserLoginModelState } from './model';
import styles from './style.less';
import { auth } from '@/utils/firebase';
import FacebookIcon from '@/assets/FacebookIcon';
import GoogleIcon from '@/assets/GoogleIcon';
import { ConnectProps, ConnectState } from '@/models/connect';

interface LoginProps extends ConnectProps {
  userLogin?: UserLoginModelState;
  submitting?: boolean;
}

@connect(({ userLogin, loading }: ConnectState) => ({
  userLogin,
  submitting: loading.effects[`${USER_LOGIN}/${SUCCESS_LOGIN}`],
}))
class Login extends Component<LoginProps> {
  // eslint-disable-next-line react/sort-comp
  signInSuccessWithAuthResult = (): boolean => {
    notification.info({ message: 'User logged in' });
    if (this.props.dispatch)
      this.props.dispatch(routerRedux.replace({ pathname: '/login/success' }));
    return false;
  };

  uiConfig: firebaseui.auth.Config = {
    signInFlow: 'redirect',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
    },
  };

  responseGoogle(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
    if (response.hasOwnProperty('error')) {
      const res: any = response;
      if (res.error !== 'idpiframe_initialization_failed') {
        console.error(res.error);
        notification.error({ message: res.error });
      }
    } else if (response.hasOwnProperty('code')) {
      const res = response as GoogleLoginResponseOffline;
      console.warn(res);
    } else {
      const res = response as GoogleLoginResponse;
      const accessToken = res.getAuthResponse().access_token;
      const idToken = res.getAuthResponse().id_token;
      const credentials = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      auth.signInWithCredential(credentials).then(this.signInSuccessWithAuthResult);
    }
  }

  render() {
    const LoginButton = ({
      name,
      onClick,
      bgColor,
      textColor,
      Icon,
    }: {
      name: string;
      onClick: any;
      bgColor: string;
      textColor: string;
      Icon: any;
    }) => (
      <div
        onClick={onClick}
        className={styles.providerButton}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <Icon
          style={{
            backgroundColor: bgColor,
            marginRight: 10,
            padding: 10,
            borderRadius: 2,
          }}
        />
        <span
          style={{
            paddingRight: 10,
            fontWeight: 500,
            paddingLeft: 0,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          Sign in with {name}
        </span>
      </div>
    );
    return (
      <div className={styles.main}>
        <GoogleLogin
          className={styles.providerButton}
          clientId="526012004991-p594on1n90qhp04qgtamgp3pjlpo7rsi.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          uxMode="redirect"
          redirectUri={`${window.location.origin}/login/success`}
          responseType="id_token permission token"
          scope="openid email profile"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy="single_host_origin"
          render={props => (
            <LoginButton
              name="Google"
              onClick={props.onClick}
              bgColor="#fff"
              textColor="rgba(0, 0, 0, .54)"
              Icon={GoogleIcon}
            />
          )}
        />
        <FacebookLogin
          appId="647403118692702"
          fields="name,email,picture"
          redirectUri={`${window.location.origin}/login/success`}
          responseType="token"
          render={(props: any) => (
            <LoginButton
              name="Facebook"
              onClick={props.onClick}
              bgColor="#4C69BA"
              textColor="#fff"
              Icon={FacebookIcon}
            />
          )}
        />
        <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
}

export default Login;
