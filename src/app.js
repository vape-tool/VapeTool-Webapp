import { persistEnhancer } from 'dva-model-persist';
import storage from 'dva-model-persist/lib/storage';
import * as sessionStorage from 'dva-model-persist/lib/storage/session';
/* eslint-disable */
export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
    },
    extraEnhancers: [persistEnhancer({
      storage,
      blacklist: ['uploadPhoto']
    }),
      persistEnhancer({
        sessionStorage,
        whitelist: ['uploadPhoto']
      })],
  },
  plugins: [process.env.APP_TYPE === 'build' ? null : require('dva-logger')()],
};
/* eslint-enable */
