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

const LoginSuccess: React.FC<{
  firebaseUser: FirebaseUser;
  dispatch: Dispatch;
}> = props => {
  const query = getPageFragment();
  const comesFromGoogleRedirect = query && query.id_token;
  if (comesFromGoogleRedirect) {
    // TODO is it called two times as well ?
    //  If yes then it's propably because we rerender when firebaseUser changes
    const credentials = firebase.auth.GoogleAuthProvider.credential(query.id_token);
    auth.signInWithCredential(credentials).then(() => {
      // TODO why is it called two times ?
      notification.info({ message: 'User logged in' });
    });
  }

  if (props.firebaseUser) {
    props.dispatch({
      type: 'userLogin/successLogin',
    });
  }
  return <PageLoading />;
};

export default connect(({ user }: ConnectState) => ({
  firebaseUser: user.firebaseUser,
}))(LoginSuccess);
