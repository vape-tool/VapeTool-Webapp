import { notification, Button, message } from 'antd';
import React from 'react';
import { FormattedMessage, history } from 'umi';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { auth } from '@/utils/firebase';
import FacebookIcon from '@/assets/FacebookIcon';
import GoogleIcon from '@/assets/GoogleIcon';
import CookieConsent from 'react-cookie-consent';
import styles from './style.less';

const Login: React.FC = () => {
  // eslint-disable-next-line react/sort-comp
  const signInSuccessWithAuthResult = (): boolean => {
    notification.info({ message: 'User logged in' });
    history.replace({ pathname: '/login/success' });
    return false;
  };

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'redirect',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult,
    },
  };

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
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
      auth.signInWithCredential(credentials).then(signInSuccessWithAuthResult);
    }
  };

  const onLoginAnonymous = async () => {
    try {
      // auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
      await auth.signInAnonymously();
      signInSuccessWithAuthResult();
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };

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
        <FormattedMessage id="signIn.method" values={{ name }} />
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
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        render={(props) => (
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
      <Button
        block
        size="large"
        style={{ marginBottom: 10, marginTop: 5 }}
        onClick={onLoginAnonymous}
      >
        Skip
      </Button>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      <CookieConsent
        location="bottom"
        buttonText="Okay!"
        cookieName="awesomeCookie"
        style={{ background: '#2B373B' }}
        buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
        expires={150}
      >
        We use cookies to enhance your experience. By continuing to visit this site you agree to our
        use of cookies.
        <a href="https://en.wikipedia.org/wiki/HTTP_cookie">More info</a>
      </CookieConsent>
    </div>
  );
};

export default Login;
