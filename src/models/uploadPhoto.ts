import { Dispatch, Reducer } from 'redux';
import { Effect } from 'dva';
import ReactCrop from 'react-image-crop';
import { Author } from '@vapetool/types';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { ConnectState } from '@/models/connect';
import { createPhoto } from '@/services/items';

export const UPLOAD_PHOTO = 'uploadPhoto';
export const SET_SRC = 'setSrc';
export const SET_CROP = 'setCrop';
export const SET_CROPPED_IMAGE = 'setCroppedImage';
export const RESET = 'reset';
export const SET_DESCRIPTION = 'setDescription';
export const SHOW_PHOTO_CHOOSER = 'showPhotoChooser';
export const HIDE_PHOTO_CHOOSER = 'hidePhotoChooser';
export const SUBMIT = 'submit';

export const submitPhoto = (dispatch: Dispatch) => dispatch({ type: `${UPLOAD_PHOTO}/${SUBMIT}` });

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
    [SET_SRC]: Reducer<UploadPhotoState>;
    [SET_CROP]: Reducer<UploadPhotoState>;
    [SET_CROPPED_IMAGE]: Reducer<UploadPhotoState>;
    [RESET]: Reducer<UploadPhotoState>;
    [SET_DESCRIPTION]: Reducer<UploadPhotoState>;
    [SHOW_PHOTO_CHOOSER]: Reducer<UploadPhotoState>;
    [HIDE_PHOTO_CHOOSER]: Reducer<UploadPhotoState>;
  };
}

// TODO consider merging with uploadPost
const Model: ModelType = {
  namespace: UPLOAD_PHOTO,

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
    *submit(_, { put, call, select }) {
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
