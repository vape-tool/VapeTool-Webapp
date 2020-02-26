import { Dispatch, Reducer } from 'redux';
import { Effect, Subscription } from 'dva';

import { getPageQuery } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import router from 'umi/router';

export const GLOBAL = 'global';
export const REDIRECT_BACK = 'redirectBack';
export const REDIRECT_TO_WITH_FOOTPRINT = 'redirectToWithFootprint';
export const CHANGE_LAYOUT_COLLAPSED = 'changeLayoutCollapsed';

export function redirectBack(dispatch: Dispatch) {
  dispatch({ type: `${GLOBAL}/${REDIRECT_BACK}` });
}

export function redirectToWithFootprint(dispatch: Dispatch, path: string) {
  dispatch({ type: `${GLOBAL}/${REDIRECT_TO_WITH_FOOTPRINT}`, path });
}

export function redirectTo(path: string) {
  router.push(path);
}

export function dispatchChangeLayoutCollapsed(dispatch: Dispatch, payload: boolean) {
  dispatch({ type: `${GLOBAL}/${REDIRECT_BACK}`, payload });
}

export interface GlobalModelState {
  collapsed: boolean;
}

export interface GlobalModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    [REDIRECT_BACK]: Effect;
    [REDIRECT_TO_WITH_FOOTPRINT]: Effect;
  };
  reducers: {
    [CHANGE_LAYOUT_COLLAPSED]: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: GLOBAL,

  state: {
    collapsed: false,
  },

  effects: {
    * redirectBack(_, { put }) {
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params as { redirect: string };
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }

      console.log(`isAbout to redirect to ${redirect || '/'}`);
      yield put(routerRedux.replace(redirect || '/'));
    },
    * redirectToWithFootprint({ path }, { put }) {
      console.log(`redirect to ${path}`);
      yield put(
        routerRedux.replace({
          pathname: path,
          search: stringify({
            redirect: window.location.href,
          }),
        }),
      );
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
