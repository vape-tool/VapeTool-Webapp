import { Reducer } from 'redux';
import { message } from 'antd';
import { Author } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { ConnectState } from '@/models/connect';
import { createPost } from '@/services/post';

export interface UploadPostState {
  title?: string;
  text?: string;
}

interface ModelType {
  namespace: string;
  state: UploadPostState;
  effects: {
    submit: Effect;
  };
  reducers: {
    setTitle: Reducer<UploadPostState>;
    setText: Reducer<UploadPostState>;
    reset: Reducer<UploadPostState>;
  };
}

const Model: ModelType = {
  namespace: 'uploadPost',

  state: {
    title: undefined,
    text: undefined,
  },

  effects: {
    * submit(_, { put, call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      const { title, text } = yield select((state: ConnectState) =>
        Object.create({
          title: state.uploadPost.title,
          text: state.uploadPost.text,
        }),
      );

      try {
        yield call(createPost, title, text, new Author(uid, name));
        message.success('Successfully published post');
        yield put({ type: 'reset' });
        yield put(routerRedux.replace({ pathname: '/cloud' }));
      } catch (e) {
        message.error('Failed upload post to cloud');
      }
    },
  },

  reducers: {
    setTitle(state, { title }): UploadPostState {
      return {
        ...state,
        title,
      };
    },
    setText(state, { text }): UploadPostState {
      return {
        ...state,
        text,
      };
    },
    reset() {
      return {
        title: undefined,
        description: undefined,
      };
    },
  },
};

export default Model;
