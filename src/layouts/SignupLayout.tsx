import { DefaultFooter, getMenuData, getPageTitle, MenuDataItem } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import { User as FirebaseUser } from 'firebase';
import { GithubOutlined } from '@ant-design/icons';
import { getCurrentUser } from '@/utils/firebase';
import { dispatchSuccessLogin } from '@/pages/login/model';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import PageLoading from '../components/PageLoading';

export interface SignupLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  firebaseUser?: FirebaseUser;
}

const SignupLayout: React.FC<SignupLayoutProps> = props => {
  const [isReady, setReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const fetchCurrentUser = () => {
    getCurrentUser().then(currentUser => {
      setReady(true);
      setFirebaseUser(currentUser);
    });
  };

  useEffect(() => fetchCurrentUser(), [firebaseUser]);

  if (!isReady) {
    return <PageLoading />;
  }
  if (firebaseUser && props.dispatch) {
    dispatchSuccessLogin(props.dispatch);
  }
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);

  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Vape Tool</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="signIn.chooseMethod"
                defaultMessage="Sign in using your favorite method"
              />
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright={formatMessage({
            id: 'misc.copyrights',
            defaultMessage: '2019 Created with ❤️ for Vapers',
          })}
          links={[
            {
              key: 'android',
              title: (
                <FormattedMessage
                  id="menu.vapeToolOnAndroid"
                  defaultMessage="VapeTool on Android"
                />
              ),
              href: 'https://play.google.com/store/apps/details?id=com.stasbar.vape_tool',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <GithubOutlined />,
              href: 'https://github.com/vape-tool/VapeTool-Webapp',
              blankTarget: true,
            },
            {
              key: 'privacy policy',
              title: <FormattedMessage id="menu.privacyPolicy" defaultMessage="Privacy Policy" />,
              href: 'https://vapetool.app/privacy_policy',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  ...settings,
  firebaseUser: user.firebaseUser,
}))(SignupLayout);
