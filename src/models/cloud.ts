import { Dispatch, Reducer } from 'redux';
import { Link, Photo, Post } from '@/types';
import { UserModelState } from '@/models/user';
import { CloudContent } from '@/models/userProfile';

export const CLOUD = 'cloud';
export const SET_ITEMS = 'setItems';

export interface CloudModelState {
  photos: Photo[];
  posts: Post[];
  links: Link[];
}

export interface CloudModelType {
  namespace: string;
  state: CloudModelState;
  reducers: {
    [SET_ITEMS]: Reducer<CloudModelState>;
  };
}

export function dispatchSetItems(
  dispatch: Dispatch,
  what: CloudContent,
  items: Post[] | Photo[] | Link[],
) {
  dispatch({
    type: `${CLOUD}/${SET_ITEMS}`,
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
  namespace: CLOUD,
  state: initialState,
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
