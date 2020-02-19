import { Dispatch, Reducer } from 'redux';
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
}

export function dispatchSetItems(
  dispatch: Dispatch,
  what: UserContent,
  items: Post[] | Photo[] | Link[],
) {
  dispatch({
    type: 'cloud/setItems',
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
};

export default CloudModel;
