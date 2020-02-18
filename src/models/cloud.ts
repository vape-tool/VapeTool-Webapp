import { Subscription } from 'dva';
import { Dispatch, Reducer } from 'redux';
import { OnlineStatus } from '@vapetool/types';
import { DataSnapshot, linksRef, photosRef, postsRef } from '@/utils/firebase';
import { getPhotoUrl } from '@/services/storage';
import { Link, Photo, Post } from '@/types';
import { UserContent, UserModelState } from '@/models/user';

export interface CloudModelState {
  photos: Photo[];
  posts: Post[];
  links: Link[];
}

export interface CloudModelType {
  namespace: string;
  state: CloudModelState;
  reducers: {
    setItems: Reducer<CloudModelState>;
  };
  subscriptions: {
    subscribePhotos: Subscription;
    subscribePosts: Subscription;
    subscribeLinks: Subscription;
  };
}


function dispatchSetItems(dispatch: Dispatch, what: UserContent, items: Post[] | Photo[] | Link[]) {
  dispatch({
    type: 'setItems',
    what,
    items,
  });
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
    setItems(state = initialState, { what, items }): CloudModelState {
      items.sort((a: Post, b: Post) => b.creationTime - a.creationTime);
      console.log({ what, setItems: items });
      return {
        ...(state as UserModelState),
        photos: what === 'photos' ? items : state?.photos,
        posts: what === 'posts' ? items : state?.posts,
        links: what === 'links' ? items : state?.links,
      };
    },
  },

  subscriptions: {
    subscribePhotos({ dispatch }) {
      console.log('subscribePhotos');
      const ref = photosRef
        .orderByChild('status')
        .equalTo(OnlineStatus.ONLINE_PUBLIC)
        .limitToLast(100);

      // TODO move to Cloud component, because it get triggered before user is logged in

      ref.on('value', async (snapshot: DataSnapshot) => {
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

        try {
          const photos = await Promise.all(photosPromise);
          dispatchSetItems(dispatch, 'photos', photos)
        } catch (err) {
          console.error('failed to fetch photosUrls ', err)
        }
      });

      return () => {
        console.log('unsubscribePhotos triggered');
        ref.off();
      };
    },

    subscribePosts({ dispatch }) {
      console.log('subscribePosts');
      const ref = postsRef
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

        dispatchSetItems(dispatch, 'posts', posts);
      });

      return () => {
        console.log('unsubscribePosts triggered');
        ref.off();
      };
    },
    subscribeLinks({ dispatch }) {
      console.log('subscribeLinks');
      const ref = linksRef
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

        dispatchSetItems(dispatch, 'links', links);
      });

      return () => {
        console.log('unsubscribeLinks triggered');
        ref.off();
      };
    },
  },
};

export default CloudModel;
