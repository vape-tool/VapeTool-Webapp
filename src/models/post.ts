import { Effect } from 'dva';
import { message, notification } from 'antd';
import { ConnectState } from '@/models/connect';
import { commentPost, deletePost, deletePostComment, likePost, reportPost } from '@/services/items';

export interface PostModelState {
}

export interface PostModelType {
  namespace: string;
  state: PostModelState;
  effects: {
    like: Effect;
    delete: Effect;
    report: Effect;
    comment: Effect;
    deleteComment: Effect;
  };
}

const PostModel: PostModelType = {
  namespace: 'Post',
  state: {},
  effects: {
    * like({ photoId }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      yield call(likePost, photoId, currentUser);
    },
    * delete({ photoId }, { call }) {
      try {
        yield call(deletePost, photoId);
        message.success('Successfully deleted Post');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    * report({ photoId }, { call, select }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      try {
        yield call(reportPost, photoId, currentUser);
        message.success('Successfully reported Post');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    * comment({ comment, photoId }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser : undefined),
      );
      if (!currentUser) {
        return;
      }

      yield call(commentPost, photoId, comment, currentUser);
    },
    * deleteComment({ photoId, commentId }, { call }) {
      try {
        yield call(deletePostComment, photoId, commentId);
        message.success('Successfully deleted comment');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
  },
};

export default PostModel;
