import { Dispatch, Reducer } from 'umi';

export enum Tab {
  PHOTO = 'photo',
  POST = 'post',
  LINK = 'link',
}
export const UPLOAD = 'upload';
export const SET_TAB = 'setTab';

export const changeTab = (dispatch: Dispatch) => (tab: string) => {
  dispatch({
    type: `${UPLOAD}/${SET_TAB}`,
    tab,
  });
};

export interface UploadState {
  currentTab: 'post' | 'photo' | 'link';
}

interface ModelType {
  namespace: string;
  state: UploadState;
  reducers: {
    [SET_TAB]: Reducer<UploadState>;
  };
}

const Model: ModelType = {
  namespace: UPLOAD,

  state: { currentTab: 'photo' },

  reducers: {
    setTab(state, { tab }) {
      return {
        ...state,
        currentTab: tab,
      };
    },
  },
};

export default Model;
