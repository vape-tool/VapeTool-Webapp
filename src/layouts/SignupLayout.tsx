import { getMenuData, getPageTitle, MenuDataItem } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { User as FirebaseUser } from 'firebase';
import { getCurrentUser } from '@/utils/firebase';
import { LayoutState } from '@/layouts/SecurityLayout';
import PageLoading from '../components/PageLoading';

export interface SignupLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
  firebaseUser: FirebaseUser;
}

class SignupLayout extends React.Component<SignupLayoutProps, LayoutState> {
  state: LayoutState = {
    isReady: false,
    firebaseUser: null,
  };

  componentDidMount() {
    this.fetchCurrentUser();
  }

  fetchCurrentUser = async () => {
    const firebaseUser = await getCurrentUser();
    this.setState({
      isReady: true,
      firebaseUser,
    });
  };

  render() {
    const { isReady, firebaseUser } = this.state;
    const { dispatch } = this.props;
    if (!isReady) {
      return <PageLoading />;
    }
    if (firebaseUser && dispatch) {
      dispatch({
        type: 'userLogin/successLogin',
      });
    }
    const {
      route = {
        routes: [],
      },
    } = this.props;
    const { routes = [] } = route;
    const {
      children,
      location = {
        pathname: '',
      },
    } = this.props;
    const { breadcrumb } = getMenuData(routes);

    return (
      <DocumentTitle
        title={getPageTitle({
          pathname: location.pathname,
          breadcrumb,
          formatMessage,
          ...this.props,
        })}
      >
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
              <div className={styles.desc}>Sign in using your favorite method</div>
            </div>
            {children}
          </div>
          <div
            style={{
              padding: '0px 24px 24px',
              textAlign: 'center',
            }}
          >
            <span>
              Vape Tool ©2019 Created with{' '}
              <span aria-label="love" role="img">
                ❤️
              </span>{' '}
              for Vapers
            </span>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ settings, user }: ConnectState) => ({
  ...settings,
  firebaseUser: user.firebaseUser,
}))(SignupLayout);
