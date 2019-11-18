import { Reducer } from 'redux';

export interface UploadState {
  currentTab: 'post' | 'photo' | 'link';
}

interface ModelType {
  namespace: string;
  state: UploadState;
  reducers: {
    setTab: Reducer<UploadState>;
  };
}

const Model: ModelType = {
  namespace: 'upload',

  state: { currentTab: 'post' },

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
