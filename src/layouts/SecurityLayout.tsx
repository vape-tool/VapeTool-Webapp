import React, { ReactElement, useEffect, useState } from 'react';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import { User as FirebaseUser } from 'firebase/app';
import { ConnectState } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import { getCurrentUser } from '@/utils/firebase';

interface SecurityLayoutProps {
  firebaseUser?: FirebaseUser;
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
  const queryString = stringify({ redirect: window.location.href });

  if (!isReady) {
    return <PageLoading />;
  }
  if (!firebaseUser && !props.firebaseUser && !window.location.pathname.startsWith('/login')) {
    return <Redirect to={`/login?${queryString}`} />;
  }
  return props.children as ReactElement;
};

export default connect(({ user, loading }: ConnectState) => ({
  firebaseUser: user.firebaseUser,
  loading: loading.models.user,
}))(SecurityLayout);
