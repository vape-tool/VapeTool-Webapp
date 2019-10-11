import { persistEnhancer } from 'dva-model-persist';
import storage from 'dva-model-persist/lib/storage';
/* eslint-disable */
export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
    },
    extraEnhancers: [persistEnhancer({ storage })],
  },
  plugins: [process.env.APP_TYPE === 'build' ? null : require('dva-logger')()],
};
/* eslint-enable */
