import { persistEnhancer } from 'dva-model-persist';
import storage from 'dva-model-persist/lib/storage/session';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
    },
    extraEnhancers: [
      persistEnhancer({
        storage,
        whitelist: [
          'user',
          'batteries',
          'coil',
          'converter',
          'global',
          'liquid',
          'ohm',
          'cloud',
          'setting',
          'upload',
          'uploadPost',
        ],
      }),
    ],
  },
  // eslint-disable-next-line global-require
  plugins: [process.env.APP_TYPE === 'build' ? {} : require('dva-logger')()],
};
