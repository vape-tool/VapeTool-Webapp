export const getCurrentUserProfileUrl = (): string => `/user/profile`;
export const getPaymentUrl = (): string => `/payment`;
export const getCurrentUserEditProfileUrl = (): string => `/user/wizard`;
export const getUserProfileUrl = (userId: string): string => `/user/profile/${userId}`;
export const getUserLoginUrl = (): string => `/user/login`;

export const getCancelSubscriptionUrl = (): string =>
  `https://www.${
    REACT_APP_ENV !== 'prod' ? 'sandbox.' : ''
  }paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=${
    REACT_APP_ENV !== 'prod' ? '62E6JFJB7ENUC' : 'ETUSF9JPSL3E8'
  }`;
