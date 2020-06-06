import { parse } from 'qs';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
export const getPageFragment = () => parse(window.location.href.split('#')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function unitFormatter(
  decimals: number,
  unit?: string,
): (value: number | string | undefined) => string {
  return (value: number | string | undefined) => {
    if (!value || value === '') {
      return '';
    }

    const number = Number(value);

    return !Number.isNaN(number) && Number.isFinite(number)
      ? `${number.toFixed(decimals)}${unit ? ` ${unit}` : ''}`
      : '';
  };
}

export function unitParser(
  decimals: number,
  unit: string,
  negativeAllowed?: boolean,
): (displayValue: string | undefined) => number | string {
  return (displayValue: string | undefined) => {
    if (!displayValue) {
      return '';
    }

    let parsed = displayValue
      .replace(unit, '') // remove unit
      .replace(/[^\d.-]/g, ''); // remove anything except digits and dots

    if (!negativeAllowed) {
      parsed = parsed.replace('-', ''); // remove minuses
    }

    if (parsed === '') {
      return '';
    }

    const value = Number(parsed);
    return Number.isNaN(value) ? 0 : value.toFixed(decimals);
  };
}

export const nanToUndefined = (str: string | number): number | undefined => {
  if (str === '' || str === undefined || str === null) {
    return undefined;
  }

  const value = Number(str);

  return Number.isNaN(value) || !Number.isFinite(value) ? undefined : value;
};

export const identity = ([a]: any[]) => a;

export const safeConvert = (
  func: (params: number[]) => number,
  params: Array<number | undefined>,
  precision = 0,
): number | undefined => {
  if (params.some(param => param === undefined)) {
    return undefined;
  }

  const safeParams = params as number[];

  const value = Number(func(safeParams).toFixed(precision));

  return nanToUndefined(value);
};

export const roundWithPrecision = (value: number, precision: number) =>
  Math.round((value + Number.EPSILON) * 10 ** precision) / 10 ** precision;

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
