import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { OnlineContentStatus } from '@vapetool/types';
import { message, notification } from 'antd';
import { database, DataSnapshot } from '@/utils/firebase';
import { Photo } from '@/types/photo';
import { getPhotoUrl } from '@/services/storage';
import { ConnectState } from '@/models/connect';
import { commentPhoto, deletePhoto, deletePhotoComment, likePhoto, reportPhoto } from '@/services/photo';

export interface PhotoModelState {
  photos: Photo[];
  selectedPhoto?: Photo;
}

export interface PhotoModelType {
  namespace: string;
  state: PhotoModelState;
  effects: {
    likePhoto: Effect;
    commentPhoto: Effect;
    deleteComment: Effect;
    deletePhoto: Effect;
    reportPhoto: Effect;
    // fetchPhotos: Effect;
  };
  reducers: {
    selectPhoto: Reducer<PhotoModelState>;
    setPhotos: Reducer<PhotoModelState>;
    addPhoto: Reducer<PhotoModelState>;
    removePhoto: Reducer<PhotoModelState>;
    setPhoto: Reducer<PhotoModelState>;
  };
  subscriptions: {
    subscribePhotos: Subscription;
  };
}

const PhotoModel: PhotoModelType = {
  namespace: 'photo',

  state: {
    photos: [],
    selectedPhoto: undefined,
  },

  effects: {
    * likePhoto({ photoId }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      yield call(likePhoto, photoId, currentUser);
    },
    * commentPhoto({ payload: { comment, photoId } }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser : undefined),
      );
      if (!currentUser) {
        return;
      }

      yield call(commentPhoto, photoId, comment, currentUser);
    },
    * deleteComment({ payload: { photoId, commentId } }, { call }) {
      try {
        yield call(deletePhotoComment, photoId, commentId);
        message.success('Successfully deleted comment');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    * deletePhoto({ photoId }, { call }) {
      try {
        yield call(deletePhoto, photoId);
        message.success('Successfully deleted photo');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    * reportPhoto({ photoId }, { call, select }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      try {
        yield call(reportPhoto, photoId, currentUser);
        message.success('Successfully reported photo');
      } catch (e) {
        notification.error({ message: e.message });
      }
    },
    // Its unused for now
    // * fetchPhotos(_, { put, call }) {
    //   const photos = yield call(getPhotos, 0, 100);
    //   yield put({
    //     type: 'setPhotos',
    //     payload: Array.isArray(photos) ? photos : [],
    //   });
    // },
  },

  reducers: {
    selectPhoto(state = { photos: [] }, { photo }): PhotoModelState {
      return {
        ...(state as PhotoModelState),
        selectedPhoto: photo,
      };
    },
    setPhotos(state = { photos: [] }, { photos }): PhotoModelState {
      return {
        ...(state as PhotoModelState),
        photos: photos.sort((a: Photo, b: Photo) => b.creationTime - a.creationTime),
      };
    },
    addPhoto(state = { photos: [] }, { photo }): PhotoModelState {
      state.photos.push(photo);
      state.photos.sort((a, b) => b.creationTime - b.creationTime);
      return {
        ...(state as PhotoModelState),
        photos: state.photos,
      };
    },
    removePhoto(state = { photos: [] }, { key }): PhotoModelState {
      const newPhotos = state.photos.filter((value: Photo) => value.uid !== key);
      return {
        ...(state as PhotoModelState),
        photos: newPhotos,
      };
    },
    setPhoto(state = { photos: [] }, { photo }): PhotoModelState {
      const newPhotos = state.photos.map((it: Photo) => (photo.uid === it.uid ? photo : it));
      return {
        ...(state as PhotoModelState),
        photos: newPhotos,
      };
    },
  },

  subscriptions: {
    subscribePhotos({ dispatch }) {
      console.log('subscribePhotos');
      const ref = database
        .ref('gears')
        .orderByChild('status')
        .equalTo(OnlineContentStatus.ONLINE_PUBLIC)
        .limitToLast(100);

      ref.on('value', (snapshot: DataSnapshot) => {
        console.log('fetched photos');
        const photosPromise: Promise<Photo>[] = new Array<Promise<Photo>>();
        snapshot.forEach(snap => {
          const photo = snap.val();
          if (!photo || Object.entries(photo).length === 0 || !photo.author) {
            console.error(`REMOVE EMPTY PHOTO: ${snap.key}`);
            return;
          }
          const promise = getPhotoUrl(snap.key || photo.uid).then((url: string) => {
            if (photo.creationTime === undefined) {
              // backwards compatibility
              photo.creationTime = photo.timestamp;
              photo.lastTimeModified = photo.timestamp;
            }
            return { ...photo, url };
          });
          photosPromise.push(promise);
        });

        Promise.all(photosPromise)
          .then(photos => {
            dispatch({
              type: 'setPhotos',
              photos,
            });
          })
          .catch(err => console.error('failed to fetch photosUrls ', err));
      });

      return () => {
        console.log('unsubscribePhotos triggered');
        ref.off();
      };
    },
  },
};

export default PhotoModel;
