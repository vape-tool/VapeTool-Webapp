import React from 'react';
import Footer from '@/components/Footer';
import CookieConsent from 'react-cookie-consent';
import styles from './style.less';

const LoginRegisterTemplate: React.FC<{}> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>{props.children}</div>
      </div>
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
      <Footer />
    </div>
  );
};

export default LoginRegisterTemplate;
