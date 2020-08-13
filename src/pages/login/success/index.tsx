import React, { useEffect } from 'react';
import firebase from 'firebase';
import { notification } from 'antd';
import PageLoading from '@/components/PageLoading';
import { getPageFragment, isProUser, userPermissionToAuthority } from '@/utils/utils';
import { auth } from '@/utils/firebase';
import { useModel, history } from 'umi';
import { getUser, initializeUser } from '@/services/user';
import { getUserWizard } from '@/places/user.places';
import { User } from '@vapetool/types';

const LoginSuccess: React.FC = () => {
  const { firebaseUser } = useModel('user');
  const { initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    if (firebaseUser && firebaseUser.isAnonymous) {
      setInitialState({
        ...initialState,
        firebaseUser,
      });
      history.replace({ pathname: '/welcome' });
    } else if (firebaseUser && !firebaseUser.isAnonymous) {
      getUser(firebaseUser.uid).then(async (user: User | undefined) => {
        if (!user) {
          // User is first time logged in
          // eslint-disable-next-line no-param-reassign
          user = await initializeUser(firebaseUser);
          // Save user to database
          if (!user) {
            // failed to save to database redirect to /oops
            history.push('/oops');
            return;
          }
          // redirect to user wizzard
          history.replace({ pathname: getUserWizard() });
        }
        const tags = [];
        if (isProUser(user.subscription)) {
          tags.push({ key: 'pro', label: 'Pro' });
        }
        const authorities = userPermissionToAuthority(
          user.permission,
          isProUser(user.subscription),
        );
        setInitialState({
          ...initialState,
          firebaseUser,
          currentUser: {
            ...user,
            name: user.display_name,
            tags,
            authorities,
          },
        });
        history.push('/');
      });
    }
  }, [firebaseUser]);

  const fragment = getPageFragment();
  const comesFromGoogleRedirect = fragment && fragment.id_token;
  const comesFromFacebookRedirect =
    fragment && fragment.state === 'facebookdirect' && fragment.access_token;
  if (comesFromGoogleRedirect) {
    // TODO clear page fragment preventing from double login because of redraw
    //  because of firebaseUser state change
    const credentials = firebase.auth.GoogleAuthProvider.credential(fragment.id_token as string);
    auth.signInWithCredential(credentials).catch((e) => {
      console.error({ signInWithCredentialFacebook: e });
      notification.error({ message: e.message });
    });
  } else if (comesFromFacebookRedirect) {
    const credentials = firebase.auth.FacebookAuthProvider.credential(
      fragment.access_token as string,
    );
    auth.signInWithCredential(credentials).catch((e) => {
      console.error({ signInWithCredentialFacebook: e });
      notification.error({ message: e.message });
    });
  }

  return <PageLoading />;
};

export default LoginSuccess;
