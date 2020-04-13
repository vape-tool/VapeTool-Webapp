import {
  Author,
  Comment,
  OnlineStatus,
  Photo as FirebasePhoto,
  Post as FirebasePost,
  Link as FirebaseLink,
} from '@vapetool/types';
import { Item, ItemName, Photo } from '@/types';
import {
  coilsRef,
  database,
  DatabaseReference,
  DataSnapshot,
  linksRef,
  liquidsRef,
  photosRef,
  postsRef,
  Query,
  ServerValue,
} from '@/utils/firebase';
import { CurrentUser } from '@/models/user';
import { getPhotoUrl, uploadPhoto } from '@/services/storage';
import { dispatchSetItems } from '@/models/cloud';
import { Dispatch } from 'redux';
import { dispatchSetUserItems } from '@/models/userProfile';

type FirebaseContent = 'gear' | 'post' | 'link';

export function subscribePhotos(dispatch: Dispatch, userId?: string): () => void {
  return subscribeItems(
    dispatch,
    ItemName.PHOTO,
    photosRef,
    (snap: DataSnapshot, photo: Photo) =>
      getPhotoUrl(snap.key || photo.uid).then((url: string) => ({
        ...photo,
        // backwards compatibility
        creationTime: photo.creationTime || photo.timestamp,
        lastTimeModified: photo.lastTimeModified || photo.timestamp,
        url,
        $type: ItemName.PHOTO,
      })),
    userId,
  );
}

export function subscribeLinks(dispatch: Dispatch, userId?: string): () => void {
  return subscribeItems(dispatch, ItemName.LINK, linksRef, null, userId);
}

export function subscribePosts(dispatch: Dispatch, userId?: string): () => void {
  return subscribeItems(dispatch, ItemName.POST, postsRef, null, userId);
}

export function subscribeCoils(dispatch: Dispatch, userId?: string): () => void {
  return subscribeItems(dispatch, ItemName.COIL, coilsRef, null, userId);
}

export function subscribeLiquids(dispatch: Dispatch, userId?: string): () => void {
  return subscribeItems(dispatch, ItemName.LIQUID, liquidsRef, null, userId);
}

export function subscribeItems<T extends Item>(
  dispatch: Dispatch,
  itemsName: ItemName,
  ref: DatabaseReference,
  transformation: ((snap: DataSnapshot, item: any) => Promise<T>) | null,
  userId?: string,
): () => void {
  let query: Query;
  if (userId) {
    query = ref.orderByChild('author/uid').equalTo(userId);
  } else {
    query = ref
      .orderByChild('status')
      .equalTo(OnlineStatus.ONLINE_PUBLIC)
      .limitToLast(100);
  }

  query.on('value', async (snapshot: DataSnapshot) => {
    const promises: Promise<T>[] = new Array<Promise<T>>();
    snapshot.forEach(snap => {
      const dbObject = snap.val();
      if (!dbObject || Object.entries(dbObject).length === 0 || !dbObject.author) {
        // beauty of weak typed database, strange things can show up here :D
        console.error(`REMOVE EMPTY POST: ${snap.key}`);
        return;
      }
      let item: Promise<T>;
      if (transformation) {
        item = transformation(snap, dbObject);
      } else {
        item = Promise.resolve({
          ...dbObject,
          $type: itemsName,
        });
      }
      promises.push(item);
    });

    const items = await Promise.all(promises);
    if (userId) {
      dispatchSetUserItems(dispatch, itemsName, items);
    } else {
      dispatchSetItems(dispatch, itemsName, items);
    }
  });

  return () => {
    query.off();
  };
}

// TODO determine if will be used
export function getPhotos(from: number, to: number): Promise<FirebasePhoto[]> {
  return new Promise<FirebasePhoto[]>((resolve, reject) => {
    photosRef
      .startAt(from)
      .endAt(to)
      .once('value')
      .then(snapshots => {
        const firebasePhotos = new Array<FirebasePhoto>();
        snapshots.forEach((snapshot: DataSnapshot) => {
          const firebasePhoto = snapshot.val();
          if (firebasePhoto && Object.entries(firebasePhoto).length !== 0) {
            firebasePhotos.push(firebasePhoto);
          }
        });
        resolve(firebasePhotos);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export async function createPost(title: string, text: string, author: Author): Promise<string> {
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null');
  }
  if (!title) {
    throw new Error('Title can not be empty');
  }

  const newObjectUid = await postsRef.push();
  const uid = newObjectUid.key;

  if (uid == null) {
    throw new Error('Could not push new post to db');
  }
  const newObject: FirebasePost = {
    uid,
    author,
    title,
    text,
    status: OnlineStatus.ONLINE_PUBLIC,
    creationTime: ServerValue.TIMESTAMP,
    lastTimeModified: ServerValue.TIMESTAMP,
  };

  await postsRef.child(uid).set(newObject);
  return uid;
}

export async function createLink(title: string, url: string, author: Author): Promise<string> {
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null');
  }
  if (!title) {
    throw new Error('Title can not be empty');
  }
  if (!url) {
    throw new Error('Url can not be empty');
  }
  const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  if (!url.match(expression)) {
    throw new Error('Invalid url');
  }

  const newObjectUid = await linksRef.push();
  const uid = newObjectUid.key;

  if (!uid) {
    throw new Error('Could not push new link to db');
  }
  const link: FirebaseLink = {
    uid,
    title,
    url,
    author,
    creationTime: ServerValue.TIMESTAMP,
    lastTimeModified: ServerValue.TIMESTAMP,
    status: OnlineStatus.ONLINE_PUBLIC,
  };

  await linksRef.child(uid).set(link);
  return uid;
}

export async function createPhoto(
  imageBlob: Blob | File,
  description: string,
  author: Author,
  width: number,
  height: number,
): Promise<string> {
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null');
  }
  if (!description) {
    throw new Error('Description can not be empty');
  }
  if (!imageBlob) {
    throw new Error('Image can not be empty');
  }
  if (!width || !height) {
    throw new Error('Width and height can not be null');
  }
  const newObjectUid = await photosRef.push();
  const uid = newObjectUid.key;

  if (uid == null) {
    throw new Error('Could not push new cloud to db');
  }
  try {
    const newObject: FirebasePhoto = {
      uid,
      author,
      description,
      status: OnlineStatus.ONLINE_PUBLIC,
      creationTime: ServerValue.TIMESTAMP,
      lastTimeModified: ServerValue.TIMESTAMP,
      timestamp: ServerValue.TIMESTAMP,
      width,
      height,
      reports: 0,
    };

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    await uploadPhoto(imageBlob, uid);
    await photosRef.child(uid).set(newObject);
    return uid;
  } catch (e) {
    photosRef.child(uid).remove();
    throw e;
  }
}

export function likePhoto(itemId: string, userId: string) {
  return like('gear', itemId, userId);
}

export function likePost(itemId: string, userId: string) {
  return like('post', itemId, userId);
}

export function likeLink(itemId: string, userId: string) {
  return like('link', itemId, userId);
}

function like(what: FirebaseContent, id: string, userId: string) {
  return database()
    .ref(`${what}-likes`)
    .child(id)
    .child(userId)
    .transaction(isLiked => {
      if (isLiked) {
        return null;
      }
      return ServerValue.TIMESTAMP;
    });
}

export function reportPhoto(postId: string, userId: string): Promise<any> {
  return report('gear', postId, userId);
}

export function reportPost(postId: string, userId: string): Promise<any> {
  return report('post', postId, userId);
}

export function reportLink(linkId: string, userId: string): Promise<any> {
  return report('link', linkId, userId);
}

function report(what: FirebaseContent, id: string, userId: string): Promise<any> {
  return database()
    .ref(`${what}-reports`)
    .child(id)
    .child(userId)
    .set(ServerValue.TIMESTAMP);
}

export function deletePhoto(postId: string): Promise<any> {
  return deleteItem('gear', postId);
}

export function deletePost(postId: string): Promise<any> {
  return deleteItem('post', postId);
}

export function deleteLink(linkId: string): Promise<any> {
  return deleteItem('link', linkId);
}

function deleteItem(what: FirebaseContent, id: string): Promise<any> {
  return database()
    .ref(`${what}s`)
    .child(id)
    .remove();
}

export function commentPhoto(id: string, content: string, { uid, name }: CurrentUser) {
  return commentItem('gear', id, content, { uid, name } as CurrentUser);
}

export function commentPost(id: string, content: string, { uid, name }: CurrentUser) {
  return commentItem('post', id, content, { uid, name } as CurrentUser);
}

export function commentLink(id: string, content: string, { uid, name }: CurrentUser) {
  return commentItem('link', id, content, { uid, name } as CurrentUser);
}

function commentItem(
  what: FirebaseContent,
  id: string,
  content: string,
  { uid, name }: CurrentUser,
) {
  const comment = new Comment(new Author(uid, name), content, ServerValue.TIMESTAMP);
  return database()
    .ref(`${what}-comments`)
    .child(id)
    .push()
    .set(comment);
}

export function deletePhotoComment(postId: string, commentId: string) {
  return deleteItemComment('gear', postId, commentId);
}

export function deletePostComment(postId: string, commentId: string) {
  return deleteItemComment('post', postId, commentId);
}

export function deleteLinkComment(linkId: string, commentId: string) {
  return deleteItemComment('link', linkId, commentId);
}

function deleteItemComment(what: FirebaseContent, id: string, commentId: string) {
  return database()
    .ref(`${what}-comments`)
    .child(id)
    .child(commentId)
    .set(null);
}
