import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { User as FirebaseUser } from 'firebase/app';
import { ConnectState } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import { getCurrentUser } from '@/utils/firebase';

interface SecurityLayoutProps {
  firebaseUser: FirebaseUser;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = props => {
  const [isReady, setReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const fetchCurrentUser = () => {
    getCurrentUser().then(currentUser => {
      setReady(true);
      setFirebaseUser(currentUser);
    });
  };

  useEffect(() => fetchCurrentUser(), [firebaseUser]);

  // You can replace it to your authentication rule (such as check token exists)
  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

  console.log(`isLogin: ${firebaseUser != null || props.firebaseUser}`);
  console.log('currentUser');
  console.log(firebaseUser);
  const queryString = stringify({ redirect: window.location.href });

  if (!isReady) {
    return <PageLoading/>;
  }
  if (!firebaseUser && !props.firebaseUser) {
    return <Redirect to={`/login?${queryString}`}/>;
  }
  return props.children as ReactElement;
};

export default connect(({ user }: ConnectState) => ({
  firebaseUser: user.firebaseUser,
}))(SecurityLayout);
