import { Reducer } from 'redux';
import { message } from 'antd';
import { Author } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { ConnectState } from '@/models/connect';

export interface UploadPostState {
  title?: string;
  description?: string;
}

interface ModelType {
  namespace: string;
  state: UploadPostState;
  effects: {
    submitPost: Effect;
  };
  reducers: {
    reset: Reducer<UploadPostState>;
  };
}

const Model: ModelType = {
  namespace: 'uploadPost',

  state: { currentTab: 'post' },

  effects: {
    *submitPost(_, { put, call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      const { title, description } = yield select((state: ConnectState) =>
        Object.create({
          title: state.uploadPost.title,
          description: state.uploadPost.description,
        }),
      );

      try {
        yield call(createPost, title, description, new Author(uid, name));
        message.success('Successfully published post');
        yield put({ type: 'reset' });
        yield put(routerRedux.replace({ pathname: '/cloud' }));
      } catch (e) {
        message.error('Failed upload post to cloud');
      }
    },
  },

  reducers: {
    reset() {
      return {
        title: undefined,
        description: undefined,
      };
    },
  },
};

export default Model;
