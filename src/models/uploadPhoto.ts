import { Reducer } from 'redux';
import { Effect } from 'dva';
import ReactCrop from 'react-image-crop';
import { Author } from '@vapetool/types';
import { message } from 'antd';
import { ConnectState } from '@/models/connect';
import { createPhoto } from '@/services/photo';

export interface UploadPhotoState {
  src?: string | null
  crop?: ReactCrop.Crop
  croppedImageUrl?: string
  croppedImageBlob?: Blob | File
  description?: string
  width?: number,
  height?: number,
}

export interface ModelType {
  namespace: string;
  state: UploadPhotoState;
  effects: {
    postPhoto: Effect;
  };
  reducers: {
    setSrc: Reducer<UploadPhotoState>;
    setCrop: Reducer<UploadPhotoState>;
    setCroppedImage: Reducer<UploadPhotoState>;
    reset: Reducer<UploadPhotoState>;
    setDescription: Reducer<UploadPhotoState>;
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
    * postPhoto(_, { call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      const { croppedImageBlob, description, width, height } =
        yield select((state: ConnectState) =>
          (Object.create({
            croppedImageBlob: state.uploadPhoto.croppedImageBlob,
            description: state.uploadPhoto.description,
            width: state.uploadPhoto.width,
            height: state.uploadPhoto.height,
          })));

      try {
        yield call(createPhoto, croppedImageBlob, description, new Author(uid, name), width, height)
        console.log('Successfully published photo');
        message.success('Successfully published photo');
      } catch (e) {
        console.error(e);
        message.error('Failed uo upload photo to cloud');
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
      };
    },
    setDescription(state, { description }) {
      return {
        ...state,
        description,
      }
    },
    reset() {
      return {
        src: undefined,
        croppedImageUrl: undefined,
        crop: undefined,
        height: undefined,
        width: undefined,
      }
    },
  },
};

export default Model;
