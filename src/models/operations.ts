import { Effect } from 'dva';
import { message, notification } from 'antd';
import { ConnectState } from '@/models/connect';
import {
  commentLink,
  commentPhoto,
  commentPost,
  deleteLink,
  deleteLinkComment,
  deletePhoto,
  deletePhotoComment,
  deletePost,
  deletePostComment,
  likeLink,
  likePhoto,
  likePost,
  reportLink,
  reportPhoto,
  reportPost,
} from '@/services/items';
import { Dispatch } from 'redux';
import { ItemName } from '@/types/Item';

export interface OperationsModelState {}

export interface OperationsModelType {
  namespace: string;
  state: OperationsModelState;
  effects: {
    like: Effect;
    delete: Effect;
    report: Effect;
    comment: Effect;
    deleteComment: Effect;
  };
}

export function dispatchLike(dispatch: Dispatch, what: ItemName, itemId: string) {
  dispatch({
    type: 'operation/like',
    what,
    itemId,
  });
}

export function dispatchComment(
  dispatch: Dispatch,
  what: ItemName,
  comment: string,
  itemId: string,
) {
  dispatch({
    type: 'operation/comment',
    what,
    comment,
    itemId,
  });
}

export function dispatchDeleteComment(
  dispatch: Dispatch,
  what: ItemName,
  commentId: string,
  itemId: string,
) {
  dispatch({
    type: 'operation/deleteComment',
    what,
    commentId,
    itemId,
  });
}

export function dispatchDelete(dispatch: Dispatch, what: ItemName, itemId: string) {
  dispatch({
    type: 'operation/delete',
    what,
    itemId,
  });
}

export function dispatchReport(dispatch: Dispatch, what: ItemName, itemId: string) {
  dispatch({
    type: 'operation/report',
    what,
    itemId,
  });
}

const OperationModel: OperationsModelType = {
  namespace: 'operation',
  state: {},
  effects: {
    *like({ itemId, what }, { select, call }) {
      // eslint-disable-next-line no-confusing-arrow
      const userId = yield select((state: ConnectState) =>
        state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined,
      );
      if (!userId) {
        return;
      }
      try {
        switch (what) {
          case 'photo':
          case 'gear':
            yield call(likePhoto, itemId, userId);
            break;
          case 'link':
            yield call(likeLink, itemId, userId);
            break;
          case 'post':
            yield call(likePost, itemId, userId);
            break;
          default:
            throw Error('unsupported operation');
        }
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    *delete({ itemId, what }, { call }) {
      try {
        switch (what) {
          case 'photo':
          case 'gear':
            yield call(deletePhoto, itemId);
            break;
          case 'link':
            yield call(deleteLink, itemId);
            break;
          case 'post':
            yield call(deletePost, itemId);
            break;
          default:
            throw Error('unsupported operation');
        }
        message.success(`Successfully deleted ${what}`);
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    *report({ itemId, what }, { call, select }) {
      // eslint-disable-next-line no-confusing-arrow
      const userId = yield select((state: ConnectState) =>
        state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined,
      );
      if (!userId) {
        return;
      }
      try {
        switch (what) {
          case 'photo':
          case 'gear':
            yield call(reportPhoto, itemId, userId);
            break;
          case 'link':
            yield call(reportLink, itemId, userId);
            break;
          case 'post':
            yield call(reportPost, itemId, userId);
            break;
          default:
            throw Error('unsupported operation');
        }
        message.success(`Successfully reported ${what}`);
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    *comment({ comment, itemId, what }, { select, call }) {
      const user = yield select((state: ConnectState) => state.user.currentUser);
      if (!user) {
        return;
      }
      try {
        switch (what) {
          case 'photo':
          case 'gear':
            yield call(commentPhoto, itemId, comment, user);
            break;
          case 'link':
            yield call(commentLink, itemId, comment, user);
            break;
          case 'post':
            yield call(commentPost, itemId, comment, user);
            break;
          default:
            throw Error('unsupported operation');
        }
      } catch (e) {
        console.error(e);
        notification.error({ message: e.message });
      }
    },

    *deleteComment({ itemId, commentId, what }, { call }) {
      try {
        switch (what) {
          case 'photo':
          case 'gear':
            yield call(deletePhotoComment, itemId, commentId);
            break;
          case 'link':
            yield call(deleteLinkComment, itemId, commentId);
            break;
          case 'post':
            yield call(deletePostComment, itemId, commentId);
            break;
          default:
            throw Error('unsupported operation');
        }
        message.success('Successfully deleted comment');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
  },
};

export default OperationModel;
