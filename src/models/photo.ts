import { Effect } from 'dva';
import { message, notification } from 'antd';
import { ConnectState } from '@/models/connect';
import { commentPhoto, deletePhoto, deletePhotoComment, likePhoto, reportPhoto } from '@/services/photo';

export interface PhotoModelState {
}

export interface PhotoModelType {
  namespace: string;
  state: PhotoModelState;
  effects: {
    like: Effect;
    comment: Effect;
    deleteComment: Effect;
    delete: Effect;
    report: Effect;
  };
}

const PhotoModel: PhotoModelType = {
  namespace: 'Photo',
  state: {},
  effects: {
    * like({ photoId }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      yield call(likePhoto, photoId, currentUser);
    },
    * delete({ photoId }, { call }) {
      try {
        yield call(deletePhoto, photoId);
        message.success('Successfully deleted Photo');
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
        yield call(reportPhoto, photoId, currentUser);
        message.success('Successfully reported Photo');
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

      yield call(commentPhoto, photoId, comment, currentUser);
    },
    * deleteComment({ photoId, commentId }, { call }) {
      try {
        yield call(deletePhotoComment, photoId, commentId);
        message.success('Successfully deleted comment');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
  },
};

export default PhotoModel;
