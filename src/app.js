import { persistEnhancer } from 'dva-model-persist';
import storage from 'dva-model-persist/lib/storage/session';
import { GLOBAL } from '@/models/global';
import { COIL } from '@/models/coil';
import { BATTERIES } from '@/models/batteries';
import { LIQUID } from '@/models/liquid';
import { SETTINGS } from '@/models/setting';
import { CLOUD } from '@/models/cloud';
import { OHM } from '@/models/ohm';
import { UPLOAD } from '@/models/upload';
import { UPLOAD_POST } from '@/models/uploadPost';
import { UPLOAD_PHOTO } from '@/models/uploadPhoto';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
    },
    extraEnhancers: [
      persistEnhancer({
        storage,
        whitelist: [
          // 'user',
          BATTERIES,
          COIL,
          'converter',
          GLOBAL,
          LIQUID,
          OHM,
          CLOUD,
          SETTINGS,
          UPLOAD,
          UPLOAD_POST,
          UPLOAD_PHOTO,
        ],
      }),
    ],
  },
  // eslint-disable-next-line global-require
  plugins: [REACT_APP_ENV === 'dev' ? require('dva-logger')() : {}],
};
