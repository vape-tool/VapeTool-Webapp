import { Effect } from 'dva';
import { message, notification } from 'antd';
import { ConnectState } from '@/models/connect';
import { commentLink, deleteLink, deleteLinkComment, likeLink, reportLink } from '@/services/items';

export interface LinkModelState {
}

export interface LinkModelType {
  namespace: string;
  state: LinkModelState;
  effects: {
    like: Effect;
    delete: Effect;
    report: Effect;
    comment: Effect;
    deleteComment: Effect;
  };
}

const LinkModel: LinkModelType = {
  namespace: 'Link',
  state: {},
  effects: {
    * like({ photoId }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      yield call(likeLink, photoId, currentUser);
    },
    * delete({ photoId }, { call }) {
      try {
        yield call(deleteLink, photoId);
        message.success('Successfully deleted Link');
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
        yield call(reportLink, photoId, currentUser);
        message.success('Successfully reported Link');
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

      yield call(commentLink, photoId, comment, currentUser);
    },
    * deleteComment({ photoId, commentId }, { call }) {
      try {
        yield call(deleteLinkComment, photoId, commentId);
        message.success('Successfully deleted comment');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
  },
};

export default LinkModel;
