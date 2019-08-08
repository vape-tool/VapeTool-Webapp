import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { notification } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState, Dispatch, UserModelState } from '@/models/connect';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
  dispatch: Dispatch;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const { dispatch, user: { currentUser, firebaseUser } } = props;
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (): boolean => {
        notification.info({ message: 'User logged in' });
        return false
      },
    },
  };

  if (!currentUser) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {currentUser.name}! You are now signed-in!</p>
      <p>Your uid is {firebaseUser && firebaseUser.uid}</p>
      <a onClick={() => dispatch({ type: 'user/logout' })}>Sign-out</a>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Cloud);
