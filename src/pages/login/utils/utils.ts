import { parse } from 'qs';
import { User } from '@vapetool/types';
import moment from 'moment';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export const isProUser = (user?: User | null): boolean =>
  !!user && user.subscription != null && moment(user.subscription).isAfter();
