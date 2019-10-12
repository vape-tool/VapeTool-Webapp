import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import ReactCrop from 'react-image-crop';

export interface UploadPhotoState {
  src?: string | null | undefined,
  crop?: ReactCrop.Crop | undefined,
  croppedImageUrl?: string | undefined
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: UploadPhotoState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: UploadPhotoState;
  effects: {
    uploadPhoto: Effect;
  };
  reducers: {
    setSrc: Reducer<UploadPhotoState>;
    setCrop: Reducer<UploadPhotoState>;
    setCroppedImageUrl: Reducer<UploadPhotoState>;
  };
}

const Model: ModelType = {
  namespace: 'uploadPhoto',

  state: {
    src: undefined,
    crop: undefined,
    croppedImageUrl: undefined,
  },

  effects: {
    * postImage(_, { put, call }) {
      console.log('aa');
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
    setCroppedImageUrl(state, { croppedImageUrl }) {
      return {
        ...state,
        croppedImageUrl,
      };
    },
  },
};

export default Model;
