import { Reducer } from 'redux';
import { message } from 'antd';
import { Author } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { ConnectState } from '@/models/connect';
import { createLink, createPost } from '@/services/post';

export interface UploadPostState {
  title?: string;
  text?: string;
}

interface ModelType {
  namespace: string;
  state: UploadPostState;
  effects: {
    submitPost: Effect;
    submitLink: Effect;
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
    * submitPost(_, { put, call, select }) {
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
        console.error(e);
        message.error('Failed upload post to cloud');
      }
    },
    * submitLink(_, { put, call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      const { title, url } = yield select((state: ConnectState) =>
        ({
          title: state.uploadPost.title,
          url: state.uploadPost.text,
        }),
      );

      try {
        yield call(createLink, title, url, new Author(uid, name));
        message.success('Successfully published link');
        yield put({ type: 'reset' });
        yield put(routerRedux.replace({ pathname: '/cloud' }));
      } catch (e) {
        console.error(e);
        message.error('Failed upload link to cloud');
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
