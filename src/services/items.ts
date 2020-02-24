import { Author, Comment, Link, OnlineStatus, Photo as FirebasePhoto, Post } from '@vapetool/types';
import { Link as LinkView, Photo as PhotoView, Post as PostView } from '@/types';
import {
  database,
  DataSnapshot,
  linksRef,
  photosRef,
  postsRef,
  ServerValue,
} from '@/utils/firebase';
import { CloudContent, CurrentUser } from '@/models/user';
import { getPhotoUrl, uploadPhoto } from '@/services/storage';
import { dispatchSetItems } from '@/models/cloud';
import { Dispatch } from 'redux';

type FirebaseContent = 'gear' | 'post' | 'link';

export function subscribePhotos(dispatch: Dispatch) {
  console.log('subscribePhotos');
  const ref = photosRef
    .orderByChild('status')
    .equalTo(OnlineStatus.ONLINE_PUBLIC)
    .limitToLast(100);

  ref.on('value', async (snapshot: DataSnapshot) => {
    console.log('fetched photos');
    const photosPromise: Promise<PhotoView>[] = new Array<Promise<PhotoView>>();
    snapshot.forEach(snap => {
      const photo = snap.val();
      if (!photo || Object.entries(photo).length === 0 || !photo.author) {
        console.error(`REMOVE EMPTY PHOTO: ${snap.key}`);
        return;
      }
      const promise: Promise<PhotoView> = getPhotoUrl(snap.key || photo.uid).then((url: string) => {
        if (photo.creationTime === undefined) {
          // backwards compatibility
          photo.creationTime = photo.timestamp;
          photo.lastTimeModified = photo.timestamp;
        }
        const photoObj: PhotoView = {
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
      dispatchSetItems(dispatch, CloudContent.PHOTOS, photos);
    } catch (err) {
      console.error('failed to fetch photosUrls ', err);
    }
  });

  return () => {
    console.log('unsubscribePhotos triggered');
    ref.off();
  };
}

export function subscribeLinks(dispatch: Dispatch) {
  const ref = linksRef
    .orderByChild('status')
    .equalTo(OnlineStatus.ONLINE_PUBLIC)
    .limitToLast(100);

  ref.on('value', (snapshot: DataSnapshot) => {
    console.log('fetched links');
    const links: LinkView[] = new Array<LinkView>();
    snapshot.forEach(snap => {
      const link = snap.val();
      if (!link || Object.entries(link).length === 0 || !link.author) {
        console.error(`REMOVE EMPTY LINK: ${snap.key}`);
        return;
      }
      const linkObject: LinkView = {
        ...link,
        $type: 'link',
      };
      links.push(linkObject);
    });

    dispatchSetItems(dispatch, CloudContent.LINKS, links);
  });

  return () => {
    console.log('unsubscribeLinks triggered');
    ref.off();
  };
}

export function subscribePosts(dispatch: Dispatch) {
  console.log('subscribePosts');
  const ref = postsRef
    .orderByChild('status')
    .equalTo(OnlineStatus.ONLINE_PUBLIC)
    .limitToLast(100);

  ref.on('value', (snapshot: DataSnapshot) => {
    console.log('fetched posts');
    const posts: PostView[] = new Array<PostView>();
    snapshot.forEach(snap => {
      const post = snap.val();
      if (!post || Object.entries(post).length === 0 || !post.author) {
        console.error(`REMOVE EMPTY POST: ${snap.key}`);
        return;
      }
      const postObject: PostView = {
        ...post,
        $type: 'post',
      };
      posts.push(postObject);
    });

    dispatchSetItems(dispatch, CloudContent.POSTS, posts);
  });

  return () => {
    console.log('unsubscribePosts triggered');
    ref.off();
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
    console.log('uploading cloud');
    console.dir(newObject);

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
