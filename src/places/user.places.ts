import { IS_NOT_PRODUCTION } from '@/utils/utils';

export const getPaymentUrl = (): string => `/payment`;
export const getUserWizard = (): string => `/user/wizard`;
export const getUserProfileUrl = (userId: string): string => `/user/profile/${userId}`;
export const getUserLoginUrl = (): string => `/login`;

export const getCancelSubscriptionUrl = (): string =>
  `https://www.${
    IS_NOT_PRODUCTION ? 'sandbox.' : ''
  }paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=${
    IS_NOT_PRODUCTION ? '62E6JFJB7ENUC' : 'ETUSF9JPSL3E8'
  }`;
