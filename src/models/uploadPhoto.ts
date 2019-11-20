import { Reducer } from 'redux';
import { Effect } from 'dva';
import ReactCrop from 'react-image-crop';
import { Author } from '@vapetool/types';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { ConnectState } from '@/models/connect';
import { createPhoto } from '@/services/photo';

export interface UploadPhotoState {
  src?: string;
  crop?: ReactCrop.Crop;
  croppedImageUrl?: string;
  croppedImageBlob?: Blob | File;
  description?: string;
  width?: number;
  height?: number;
  showPhotoChooser?: boolean;
  cancelled?: boolean;
}

export interface ModelType {
  namespace: string;
  state: UploadPhotoState;
  effects: {
    submit: Effect;
  };
  reducers: {
    setSrc: Reducer<UploadPhotoState>;
    setCrop: Reducer<UploadPhotoState>;
    setCroppedImage: Reducer<UploadPhotoState>;
    reset: Reducer<UploadPhotoState>;
    setDescription: Reducer<UploadPhotoState>;
    showPhotoChooser: Reducer<UploadPhotoState>;
    hidePhotoChooser: Reducer<UploadPhotoState>;
  };
}

const Model: ModelType = {
  namespace: 'uploadPhoto',

  state: {
    src: undefined,
    crop: undefined,
    croppedImageUrl: undefined,
    croppedImageBlob: undefined,
    description: undefined,
    width: undefined,
    height: undefined,
  },

  effects: {
    * submit(_, { put, call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      const { croppedImageBlob, description, width, height } = yield select((state: ConnectState) =>
        Object.create({
          croppedImageBlob: state.uploadPhoto.croppedImageBlob,
          description: state.uploadPhoto.description,
          width: state.uploadPhoto.width,
          height: state.uploadPhoto.height,
        }),
      );

      try {
        yield call(
          createPhoto,
          croppedImageBlob,
          description,
          new Author(uid, name),
          width,
          height,
        );
        message.success('Successfully published cloud');
        yield put({ type: 'reset' });
        yield put(routerRedux.replace({ pathname: '/cloud' }));
      } catch (e) {
        message.error('Failed upload cloud to cloud');
      }
    },
  },

  reducers: {
    setSrc(state, { src }) {
      return {
        ...state,
        src,
      };
    },
    setCrop(state, { crop }) {
      return {
        ...state,
        crop,
      };
    },
    setCroppedImage(state, { url, blob, width, height }) {
      return {
        ...state,
        croppedImageUrl: url,
        croppedImageBlob: blob,
        width,
        height,
        showPhotoChooser: false,
      };
    },
    setDescription(state, { description }) {
      return {
        ...state,
        description,
      };
    },
    reset() {
      return {
        src: undefined,
        croppedImageUrl: undefined,
        croppedImageBlob: undefined,
        crop: undefined,
        height: undefined,
        width: undefined,
      };
    },
    showPhotoChooser(state) {
      return {
        ...state,
        showPhotoChooser: true,
      };
    },
    hidePhotoChooser(state) {
      return {
        ...state,
        showPhotoChooser: false,
        cancelled: true,
      };
    },
  },
};

export default Model;
