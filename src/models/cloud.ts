import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import { OnlineStatus } from '@vapetool/types';
import { message, notification } from 'antd';
import { database, DataSnapshot } from '@/utils/firebase';
import { Photo } from '@/types/photo';
import { getPhotoUrl } from '@/services/storage';
import { ConnectState } from '@/models/connect';
import { commentPhoto, deletePhoto, deletePhotoComment, likePhoto, reportPhoto } from '@/services/photo';
import { Post } from '@/types/Post';
import { Link } from '@/types/Link';

export interface CloudModelState {
  photos: Photo[];
  posts: Post[];
  links: Link[];
  selectedItem?: Photo | Post | Link;
}

export interface CloudModelType {
  namespace: string;
  state: CloudModelState;
  effects: {
    likePhoto: Effect;
    commentPhoto: Effect;
    deleteComment: Effect;
    deletePhoto: Effect;
    reportPhoto: Effect;
    // fetchPhotos: Effect;
  };
  reducers: {
    selectItem: Reducer<CloudModelState>;
    setPhotos: Reducer<CloudModelState>;
    setPosts: Reducer<CloudModelState>;
    setLinks: Reducer<CloudModelState>;
  };
  subscriptions: {
    subscribePhotos: Subscription;
    subscribePosts: Subscription;
    subscribeLinks: Subscription;
  };
}

const initialState: CloudModelState = {
  photos: [],
  posts: [],
  links: [],
  selectedItem: undefined,
};

const CloudModel: CloudModelType = {
  namespace: 'cloud',
  state: initialState,

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
        message.success('Successfully deleted cloud');
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
        message.success('Successfully reported cloud');
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
    // TODO merge them together
    selectItem(state = initialState, { item }): CloudModelState {
      return {
        ...(state as CloudModelState),
        selectedItem: item,
      };
    },
    setPosts(state = initialState, { posts }): CloudModelState {
      return {
        ...(state as CloudModelState),
        posts: posts.sort((a: Post, b: Post) => b.creationTime - a.creationTime),
      };
    },
    setPhotos(state = initialState, { photos }): CloudModelState {
      return {
        ...(state as CloudModelState),
        photos: photos.sort((a: Photo, b: Photo) => (b.creationTime - a.creationTime)),
      };
    },
    setLinks(state = initialState, { links }): CloudModelState {
      return {
        ...(state as CloudModelState),
        links: links.sort((a: Link, b: Link) => (b.creationTime - a.creationTime)),
      };
    },
  },

  subscriptions: {
    subscribePhotos({ dispatch }) {
      console.log('subscribePhotos');
      const ref = database
        .ref('gears')
        .orderByChild('status')
        .equalTo(OnlineStatus.ONLINE_PUBLIC)
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
          const promise: Promise<Photo> = getPhotoUrl(snap.key || photo.uid).then((url: string) => {
            if (photo.creationTime === undefined) {
              // backwards compatibility
              photo.creationTime = photo.timestamp;
              photo.lastTimeModified = photo.timestamp;
            }
            const photoObj: Photo = {
              ...photo,
              url,
              $type: 'photo',
            };
            return photoObj;
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

    subscribePosts({ dispatch }) {
      console.log('subscribePosts');
      const ref = database
        .ref('posts')
        .orderByChild('status')
        .equalTo(OnlineStatus.ONLINE_PUBLIC)
        .limitToLast(100);

      ref.on('value', (snapshot: DataSnapshot) => {
        console.log('fetched posts');
        const posts: Post[] = new Array<Post>();
        snapshot.forEach(snap => {
          const post = snap.val();
          if (!post || Object.entries(post).length === 0 || !post.author) {
            console.error(`REMOVE EMPTY POST: ${snap.key}`);
            return;
          }
          const postObject: Post = {
            ...post,
            $type: 'post',
          };
          posts.push(postObject);
        });

        dispatch({
          type: 'setPosts',
          posts,
        });
      });

      return () => {
        console.log('unsubscribePosts triggered');
        ref.off();
      };
    },
    subscribeLinks({ dispatch }) {
      console.log('subscribeLinks');
      const ref = database
        .ref('links')
        .orderByChild('status')
        .equalTo(OnlineStatus.ONLINE_PUBLIC)
        .limitToLast(100);

      ref.on('value', (snapshot: DataSnapshot) => {
        console.log('fetched links');
        const links: Link[] = new Array<Link>();
        snapshot.forEach(snap => {
          const link = snap.val();
          if (!link || Object.entries(link).length === 0 || !link.author) {
            console.error(`REMOVE EMPTY LINK: ${snap.key}`);
            return;
          }
          const linkObject: Link = {
            ...link,
            $type: 'link',
          };
          links.push(linkObject);
        });

        dispatch({
          type: 'setLinks',
          links,
        });
      });

      return () => {
        console.log('unsubscribeLinks triggered');
        ref.off();
      };
    },
  },
};

export default CloudModel;
