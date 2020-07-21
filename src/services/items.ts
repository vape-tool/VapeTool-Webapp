import {
  Author,
  Comment,
  OnlineStatus,
  Photo as FirebasePhoto,
  Post as FirebasePost,
  Link as FirebaseLink,
  Liquid as FirebaseLiquid,
  Coil as FirebaseCoil,
} from '@vapetool/types';
import { Item, ItemName, Photo, Liquid, Coil, Post, Link } from '@/types';
import {
  coilsRef,
  database,
  linksRef,
  liquidsRef,
  photosRef,
  postsRef,
  ServerValue,
} from '@/utils/firebase';
import { CurrentUser } from '@/app';
import { getPhotoUrl, uploadPhoto } from '@/services/storage';

type FirebaseContent = 'gear' | 'post' | 'link';

export function subscribePhotos(
  onValueChange: (items: Photo[]) => void,
  userId?: string,
): () => void {
  return subscribeItems<Photo>(
    ItemName.PHOTO,
    photosRef,
    (snap: firebase.database.DataSnapshot, photo: Photo) =>
      getPhotoUrl(snap.key || photo.uid).then((url: string) => ({
        ...photo,
        // backwards compatibility
        creationTime: photo.creationTime || photo.timestamp,
        lastTimeModified: photo.lastTimeModified || photo.timestamp,
        url,
        $type: ItemName.PHOTO,
      })),
    onValueChange,
    userId,
  );
}

export function subscribeLinks(
  onValueChange: (items: Link[]) => void,
  userId?: string,
): () => void {
  return subscribeItems<Link>(ItemName.LINK, linksRef, null, onValueChange, userId);
}

export function subscribePosts(
  onValueChange: (items: Post[]) => void,
  userId?: string,
): () => void {
  return subscribeItems<Post>(ItemName.POST, postsRef, null, onValueChange, userId);
}

export function subscribeCoils(
  onValueChange: (items: Coil[]) => void,
  userId?: string,
): () => void {
  return subscribeItems<Coil>(ItemName.COIL, coilsRef, null, onValueChange, userId);
}

export function subscribeLiquids(
  onValueChange: (items: Liquid[]) => void,
  userId?: string,
): () => void {
  return subscribeItems<Liquid>(ItemName.LIQUID, liquidsRef, null, onValueChange, userId);
}

export function subscribeItems<T extends Item>(
  itemsName: ItemName,
  ref: firebase.database.Reference,
  transformation: ((snap: firebase.database.DataSnapshot, item: any) => Promise<T>) | null,
  onValueChange: (items: T[]) => void,
  userId?: string,
): () => void {
  let query: firebase.database.Query;
  if (userId) {
    query = ref.orderByChild('author/uid').equalTo(userId);
  } else {
    query = ref.orderByChild('status').equalTo(OnlineStatus.ONLINE_PUBLIC).limitToLast(100);
  }

  const listener = query.on('value', async (snapshot: firebase.database.DataSnapshot) => {
    const promises: Promise<T>[] = new Array<Promise<T>>();
    snapshot.forEach((snap) => {
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
    onValueChange(items);
  });

  return () => query.off('value', listener);
}

// TODO determine if will be used
export function getPhotos(from: number, to: number): Promise<FirebasePhoto[]> {
  return new Promise<FirebasePhoto[]>((resolve, reject) => {
    photosRef
      .startAt(from)
      .endAt(to)
      .once('value')
      .then((snapshots) => {
        const firebasePhotos = new Array<FirebasePhoto>();
        snapshots.forEach((snapshot: firebase.database.DataSnapshot) => {
          const firebasePhoto = snapshot.val();
          if (firebasePhoto && Object.entries(firebasePhoto).length !== 0) {
            firebasePhotos.push(firebasePhoto);
          }
        });
        resolve(firebasePhotos);
      })
      .catch((e) => {
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
  // every argument shouldn't be undefined, but i prefer handling exceptions there
  imageBlob: Blob | File | undefined,
  description: string,
  author: Author,
  width: number | undefined,
  height: number | undefined,
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

export async function saveLiquid(
  liquid: Omit<FirebaseLiquid, 'name' | 'description'>,
  author: Author,
  name: string,
  description: string,
) {
  const newObjectUid = await liquidsRef.push();
  const uid = newObjectUid.key;
  if (uid == null) {
    throw new Error('Could not push new liquid to db');
  }
  if (!author) {
    throw new Error('Author can not be null');
  }
  try {
    const newObject: FirebaseLiquid = {
      uid,
      author,
      name,
      description,
      creationTime: ServerValue.TIMESTAMP,
      lastTimeModified: ServerValue.TIMESTAMP,
      status: OnlineStatus.ONLINE_PUBLIC,
      baseStrength: liquid.baseStrength,
      baseRatio: liquid.baseRatio,
      thinner: liquid.thinner,
      targetStrength: liquid.targetStrength,
      targetRatio: liquid.targetRatio,
      amount: liquid.amount,
      rating: liquid.rating,
      flavors: liquid.flavors,
    };
    console.log('saving liquid', newObject);
    await liquidsRef.child(uid).set(newObject);
    return uid;
  } catch (e) {
    liquidsRef.child(uid).remove();
    throw e;
  }
}
export async function saveCoil(
  coil: Omit<FirebaseCoil, 'name' | 'description'>,
  author: Author,
  name: string,
  description: string,
) {
  const newObjectUid = await coilsRef.push();
  const uid = newObjectUid.key;
  if (uid == null) {
    throw new Error('Could not push new coil to db');
  }
  if (!author) {
    throw new Error('Author can not be null');
  }
  try {
    const newObject: FirebaseCoil = {
      uid,
      author,
      name,
      description,
      creationTime: ServerValue.TIMESTAMP,
      lastTimeModified: ServerValue.TIMESTAMP,
      status: OnlineStatus.ONLINE_PUBLIC,
      type: coil.type,
      setup: coil.setup,
      wraps: coil.wraps,
      resistance: coil.resistance,
      legsLength: coil.legsLength,
      innerDiameter: coil.innerDiameter,
      pitch: coil.pitch,
      heightDiameter: coil.heightDiameter,
      widthDiameter: coil.widthDiameter,
      totalLength: coil.totalLength,
      cores: coil.cores,
      outers: coil.outers,
    };
    console.log('saving coil', newObject);

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    // await uploadPhoto(imageBlob, uid);
    await coilsRef.child(uid).set(newObject);
    return uid;
  } catch (e) {
    coilsRef.child(uid).remove();
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
    .transaction((isLiked) => {
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
  return database().ref(`${what}-reports`).child(id).child(userId).set(ServerValue.TIMESTAMP);
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
  return database().ref(`${what}s`).child(id).remove();
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
  return database().ref(`${what}-comments`).child(id).push().set(comment);
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
  return database().ref(`${what}-comments`).child(id).child(commentId).set(null);
}
