import { Dispatch, Reducer } from 'redux';
import { message } from 'antd';
import { Author } from '@vapetool/types';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { ConnectState } from '@/models/connect';
import { createLink, createPost } from '@/services/items';

export const UPLOAD_POST = 'uploadPost';
export const SUBMIT_POST = 'submitPost';
export const SUBMIT_LINK = 'submitLink';
export const SET_TITLE = 'setTitle';
export const SET_TEXT = 'setText';
export const RESET = 'reset';

export function dispatchSetText(dispatch: Dispatch, text: string) {
  dispatch({
    type: `${UPLOAD_POST}/${SET_TEXT}`,
    text,
  });
}

export function dispatchSetTitle(dispatch: Dispatch, title: string) {
  dispatch({
    type: `${UPLOAD_POST}/${SET_TITLE}`,
    title,
  });
}

export function dispatchSubmit(dispatch: Dispatch, what: string) {
  dispatch({
    type: `${UPLOAD_POST}/${what}`,
  });
}

export interface UploadPostState {
  title?: string;
  text?: string;
}

// TODO consider merging with uploadPhoto
interface ModelType {
  namespace: string;
  state: UploadPostState;
  effects: {
    [SUBMIT_POST]: Effect;
    [SUBMIT_LINK]: Effect;
  };
  reducers: {
    [SET_TITLE]: Reducer<UploadPostState>;
    [SET_TEXT]: Reducer<UploadPostState>;
    [RESET]: Reducer<UploadPostState>;
  };
}

const Model: ModelType = {
  namespace: UPLOAD_POST,

  state: {
    title: undefined,
    text: undefined,
  },

  effects: {
    *submitPost(_, { put, call, select }) {
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
    *submitLink(_, { put, call, select }) {
      const { uid, name } = yield select((state: ConnectState) => state.user.currentUser);

      // eslint-disable-next-line prefer-const
      let { url, text }: { url: string; text: string } = yield select((state: ConnectState) => ({
        url: state.uploadPost.title,
        text: state.uploadPost.text,
      }));
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }

      try {
        yield call(createLink, text, url, new Author(uid, name));
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
