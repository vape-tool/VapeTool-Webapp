import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { User as FirebaseUser } from 'firebase/app';
import { ConnectProps, ConnectState } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import { getCurrentUser } from '@/utils/firebase';

interface SecurityLayoutProps extends ConnectProps {
  firebaseUser?: FirebaseUser;
}

export interface LayoutState {
  isReady: boolean;
  firebaseUser: FirebaseUser | null;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, LayoutState> {
  state: LayoutState = {
    isReady: false,
    firebaseUser: null,
  };

  componentDidMount() {
    this.checkIfUserAlreadyLoggedIn();
  }

  checkIfUserAlreadyLoggedIn = async () => {
    const firebaseUser = await getCurrentUser();
    this.setState({
      isReady: true,
      firebaseUser,
    });
  };

  render() {
    const { isReady, firebaseUser } = this.state;
    const { children } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    console.log(`isLogin: ${firebaseUser != null || this.props.firebaseUser}`);
    console.log('currentUser');
    console.log(firebaseUser);
    const queryString = stringify({ redirect: window.location.href });

    if (!isReady) {
      return <PageLoading />;
    }
    if (!firebaseUser && !this.props.firebaseUser) {
      return <Redirect to={`/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user }: ConnectState) => ({
  firebaseUser: user.firebaseUser,
}))(SecurityLayout);
