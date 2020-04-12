const { NODE_ENV } = process.env;

export const getCurrentUserProfileUrl = (): string => `/user/profile`;
export const getCurrentUserEditProfileUrl = (): string => `/user/wizard`;
export const getUserProfileUrl = (userId: string): string => `/user/profile/${userId}`;
export const getUserLoginUrl = (): string => `/user/login`;
export const getPaymentUrl = (): string => `/payment`;

export const getCancelSubscriptionUrl = (): string =>
  `https://www.${
    NODE_ENV === 'development' ? 'sandbox.' : ''
  }paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=${
    NODE_ENV === 'production' ? 'ETUSF9JPSL3E8' : '62E6JFJB7ENUC'
  }`;
