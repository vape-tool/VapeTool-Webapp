import { Photo, Post, Link, Liquid, Coil } from '@/types'
import { Dispatch, Reducer } from 'redux';
import {
  Photo as FirebasePhoto,
  Post as FirebasePost,
  Link as FirebaseLink,
  Coil as FirebaseCoil,
  Liquid as FirebaseLiquid,
} from '@vapetool/types';

export interface PreviewModelState {
  selectedItem?: Photo | Post | Link | Coil | Liquid;
}

export function dispatchSelectItem(
  dispatch: Dispatch,
  item: Photo | FirebasePhoto | Post | FirebasePost | Link | FirebaseLink | Coil | FirebaseCoil
    | Liquid | FirebaseLiquid | undefined,
) {
  dispatch({
    type: 'preview/selectItem',
    item,
  });
}

export interface PreviewModelType {
  namespace: string;
  state: PreviewModelState;
  reducers: {
    selectItem: Reducer<PreviewModelState>;
  };
}

const PreviewModel: PreviewModelType = {
  namespace: 'preview',
  state: {
    selectedItem: undefined,
  },

  reducers: {
    selectItem(state = { selectedItem: undefined }, { item }): PreviewModelState {
      return {
        ...(state as PreviewModelState),
        selectedItem: item,
      };
    },
  },
};

export default PreviewModel;
