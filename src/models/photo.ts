import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { OnlineContentStatus } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { Photo } from '@/types/photo';
import { getPhotoUrl } from '@/services/storage';
import { ConnectState } from '@/models/connect';
import { commentPhoto, getPhotos, likePhoto } from '@/services/photo';

export interface PhotoModelState {
  photos: Photo[];
}

export interface PhotoModelType {
  namespace: string;
  state: PhotoModelState;
  effects: {
    likePhoto: Effect;
    commentPhoto: Effect;
    fetchPhotos: Effect;
  };
  reducers: {
    addPhotos: Reducer<PhotoModelState>;
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
  },

  effects: {
    * likePhoto({ payload }, { select, call }) {
      const currentUser = yield select((state: ConnectState) =>
        (state.user.currentUser !== undefined ? state.user.currentUser.uid : undefined),
      );
      if (!currentUser) {
        return;
      }
      yield call(likePhoto, payload, currentUser);
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
    * fetchPhotos(_, { put, call }) {
      const photos = yield call(getPhotos, 0, 100);
      yield put({
        type: 'setPhotos',
        payload: Array.isArray(photos) ? photos : [],
      });
    },
  },

  reducers: {
    addPhotos(state = { photos: [] }, { photos }): PhotoModelState {
      state.photos.push(photos);
      return {
        ...(state as PhotoModelState),
        photos: state.photos,
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

      ref.on('child_added', (snapshot: DataSnapshot) => {
        if (!snapshot || !snapshot.key) {
          return;
        }
        getPhotoUrl(snapshot.key).then(url =>
          dispatch({
            type: 'addPhoto',
            photo: Object.create({ ...snapshot.val(), url }) as Photo,
          }),
        );
      });
      ref.on('child_changed', (snapshot: DataSnapshot) => {
        dispatch({
          type: 'setPhoto',
          photo: snapshot.val(),
        });
      });
      ref.on('child_removed', (snapshot: DataSnapshot) => {
        dispatch({
          type: 'removePhoto',
          key: snapshot.key,
        });
      });

      return () => {
        console.log('unsubscribePhotos triggered');
        ref.off();
      };
    },
  },
};

export default PhotoModel;
