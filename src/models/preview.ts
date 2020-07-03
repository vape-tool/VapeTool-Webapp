import { Item } from '@/types';
import { Dispatch, Reducer } from 'umi';

export const PREVIEW = 'preview';
export const SELECT_ITEM = 'selectItem';

export interface PreviewModelState {
  selectedItem?: Item;
}

export function dispatchSelectItem(dispatch: Dispatch, item?: Item) {
  dispatch({
    type: `${PREVIEW}/${SELECT_ITEM}`,
    item,
  });
}

export interface PreviewModelType {
  namespace: string;
  state: PreviewModelState;
  reducers: {
    [SELECT_ITEM]: Reducer<PreviewModelState>;
  };
}

const PreviewModel: PreviewModelType = {
  namespace: PREVIEW,
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
