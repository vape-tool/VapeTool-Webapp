import { Author, Comment, Link, OnlineStatus, Photo as FirebasePhoto, Post } from '@vapetool/types';
import { database, DataSnapshot, ServerValue } from '@/utils/firebase';
import { CurrentUser } from '@/models/user';
import { uploadPhoto } from '@/services/storage';
import { ItemName } from '@/types/Item';


// TODO determine if will be used
export function getPhotos(from: number, to: number): Promise<FirebasePhoto[]> {
  return new Promise<FirebasePhoto[]>((resolve, reject) => {
    database
      .ref('gears')
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

  const newObjectUid = await database.ref('posts').push();
  const uid = newObjectUid.key;

  if (uid == null) {
    throw new Error('Could not push new post to db');
  }
  const newObject: Post = {
    uid,
    author,
    title,
    text,
    status: OnlineStatus.ONLINE_PUBLIC,
    creationTime: ServerValue.TIMESTAMP,
    lastTimeModified: ServerValue.TIMESTAMP,
  };
  console.log('uploading post');
  console.dir(newObject);

  await database.ref(`posts/${uid}`).set(newObject);
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

  const newObjectUid = await database.ref('links').push();
  const uid = newObjectUid.key;

  if (!uid) {
    throw new Error('Could not push new link to db');
  }
  const link: Link = {
    uid,
    title,
    url,
    author,
    creationTime: ServerValue.TIMESTAMP,
    lastTimeModified: ServerValue.TIMESTAMP,
    status: OnlineStatus.ONLINE_PUBLIC,
  };
  console.log('uploading link');
  console.dir(link);

  await database.ref(`links/${uid}`).set(link);
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
  const newObjectUid = await database.ref('gears').push();
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
    console.log('uploading cloud');
    console.dir(newObject);

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    await uploadPhoto(imageBlob, uid);
    await database.ref(`gears/${uid}`).set(newObject);
    return uid;
  } catch (e) {
    database.ref(`gears/${uid}`).remove();
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

function like(what: ItemName, id: string, userId: string) {
  return database
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

function report(what: ItemName, id: string, userId: string): Promise<any> {
  return database
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

function deleteItem(what: ItemName, id: string): Promise<any> {
  return database
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

function commentItem(what: ItemName, id: string, content: string, { uid, name }: CurrentUser) {
  const comment = new Comment(new Author(uid, name), content, ServerValue.TIMESTAMP);
  return database
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

function deleteItemComment(what: ItemName, id: string, commentId: string) {
  return database
    .ref(`${what}-comments`)
    .child(id)
    .child(commentId)
    .set(null);
}
