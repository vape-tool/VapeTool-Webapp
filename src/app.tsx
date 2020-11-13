import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import firebase from 'firebase';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { User } from '@vapetool/types';
import defaultSettings from '../config/defaultSettings';
import { getCurrentUser } from './utils/firebase';
import { getUser, initializeUser } from './services/user';
import { isProUser, userPermissionToAuthority } from './utils/utils';
import { getUserWizard } from './places/user.places';
import { UserAuthorities } from './types/UserAuthorities';
import logo from './assets/logo.svg';

export interface CurrentUser extends User {
  name: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
  authorities?: UserAuthorities[];
}

export async function getInitialState(): Promise<{
  firebaseUser?: firebase.User;
  currentUser?: CurrentUser;
  settings?: LayoutSettings;
}> {
  console.log('getInitalState', history.location.pathname);
  if (history.location.pathname === '/login' || history.location.pathname === '/login/success') {
    return {
      settings: defaultSettings,
    };
  }
  try {
    const firebaseUser = await getCurrentUser();
    console.log({ firebaseUser });
    if (!firebaseUser) throw new Error('User not logged in');

    firebase.remoteConfig().fetchAndActivate();

    console.log({ userIsAnonymous: firebaseUser.isAnonymous });
    if (firebaseUser.isAnonymous) {
      history.replace({ pathname: '/' });
      console.log('logged in as anonymous');
      return {
        firebaseUser,
        settings: defaultSettings,
      };
    }

    let user: User | undefined = await getUser(firebaseUser.uid);
    if (!user) {
      console.log('Logged in as current user');
      // User is first time logged in
      user = await initializeUser(firebaseUser);
      // Save user to database
      if (!user) {
        // Failed to save to database redirect to /Oops
        history.push('/oops');
        return {
          firebaseUser,
          settings: defaultSettings,
        };
      }
      // Redirect to user wizzard
      history.push(getUserWizard());
    }
    const tags = [];
    if (isProUser(user.subscription)) {
      tags.push({ key: 'pro', label: 'Pro' });
    }
    const authorities = userPermissionToAuthority(user.permission, isProUser(user.subscription));
    return {
      firebaseUser,
      currentUser: {
        ...user,
        name: user.display_name,
        tags,
        authorities,
      },
      settings: defaultSettings,
    };
  } catch (error) {
    console.error('redirecting to /login', error);
    history.push('/login');
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser: any; firebaseUser: any };
}): BasicLayoutProps => {
  console.log({ currentUser: initialState.currentUser, firebaseUser: initialState.firebaseUser });
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    logo,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: 'Ok',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Now Allowed',
  406: 'Not Acceptable',
  410: 'Gone',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Error ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: 'Connection time out',
      message: 'Error',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
