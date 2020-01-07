import { Subscription } from 'dva';
import { Reducer } from 'redux';
import { OnlineStatus } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { getPhotoUrl } from '@/services/storage';
import { Link, Photo, Post } from '@/types';

export interface CloudModelState {
  photos: Photo[];
  posts: Post[];
  links: Link[];
}

export interface CloudModelType {
  namespace: string;
  state: CloudModelState;
  reducers: {
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
};

const CloudModel: CloudModelType = {
  namespace: 'cloud',
  state: initialState,

  // Its unused for now
  // * fetchPhotos(_, { put, call }) {
  //   const photos = yield call(getPhotos, 0, 100);
  //   yield put({
  //     type: 'setPhotos',
  //     payload: Array.isArray(photos) ? photos : [],
  //   });
  // },

  reducers: {
    // TODO merge them together
    setPosts(state = initialState, { posts }): CloudModelState {
      return {
        ...(state as CloudModelState),
        posts: posts.sort((a: Post, b: Post) => b.creationTime - a.creationTime),
      };
    },
    setPhotos(state = initialState, { photos }): CloudModelState {
      return {
        ...(state as CloudModelState),
        photos: photos.sort((a: Photo, b: Photo) => b.creationTime - a.creationTime),
      };
    },
    setLinks(state = initialState, { links }): CloudModelState {
      return {
        ...(state as CloudModelState),
        links: links.sort((a: Link, b: Link) => b.creationTime - a.creationTime),
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
