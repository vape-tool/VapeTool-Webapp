import { Photo } from '@/types/Photo';
import { Post } from '@/types/Post';
import { Link } from '@/types/Link';
import { Dispatch, Reducer } from 'redux';
import { Photo as FirebasePhoto } from '@vapetool/types/dist/photo';
import { Post as FirebasePost } from '@vapetool/types/dist/post';
import { Link as FirebaseLink } from '@vapetool/types/dist/link';

export interface PreviewModelState {
  selectedItem?: Photo | Post | Link;
}

export function dispatchSelectItem(
  dispatch: Dispatch,
  item: Photo | FirebasePhoto | Post | FirebasePost | Link | FirebaseLink | undefined,
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
