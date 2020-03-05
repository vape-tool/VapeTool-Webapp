import React from 'react';
import { connect } from 'dva';
import { User as FirebaseUser } from 'firebase/app';
import firebase from 'firebase';
import { notification } from 'antd';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import { getPageFragment } from '@/utils/utils';
import { auth } from '@/utils/firebase';
import { dispatchSuccessLogin } from '@/pages/login/model';

const LoginSuccess: React.FC<{
  firebaseUser?: FirebaseUser;
  dispatch: Dispatch;
}> = props => {
  const fragment = getPageFragment();
  const comesFromGoogleRedirect = fragment && fragment.id_token;
  const comesFromFacebookRedirect =
    fragment && fragment.state === 'facebookdirect' && fragment.access_token;
  if (comesFromGoogleRedirect) {
    // TODO clear page fragment preventing from double login because of redraw
    //  because of firebaseUser state change
    const credentials = firebase.auth.GoogleAuthProvider.credential(fragment.id_token);
    auth.signInWithCredential(credentials).catch(e => {
      console.error({ signInWithCredentialFacebook: e });
      notification.error({ message: e.message });
    });
  } else if (comesFromFacebookRedirect) {
    const credentials = firebase.auth.FacebookAuthProvider.credential(fragment.access_token);
    auth.signInWithCredential(credentials).catch(e => {
      console.error({ signInWithCredentialFacebook: e });
      notification.error({ message: e.message });
    });
  }

  if (props.firebaseUser) {
    dispatchSuccessLogin(props.dispatch);
  }
  return <PageLoading />;
};

export default connect(({ user }: ConnectState) => ({
  firebaseUser: user.firebaseUser,
}))(LoginSuccess);
