import { Author, Comment, OnlineStatus } from '@vapetool/types';
import { database, DataSnapshot, ServerValue } from '@/utils/firebase';
import { Photo, Photo as FirebasePhoto } from '@/types/photo';
import { getImageUrl, uploadPhoto } from '@/services/storage';
import { CurrentUser } from '@/models/user';

export function getUserPhotos(uid: string): Promise<Photo[]> {
  return new Promise<Photo[]>((resolve, reject) => {
    database
      .ref('gears')
      .orderByChild('author/uid')
      .equalTo(uid)
      .once('value')
      .then(snapshots => {
        const firebasePhotos: FirebasePhoto[] = [];
        snapshots.forEach((snapshot: DataSnapshot) => {
          const firebasePhoto = snapshot.val();
          firebasePhotos.push(firebasePhoto);
        });
        const photosPromise = firebasePhotos.map(photo =>
          getImageUrl('photo', photo.uid).then(url => Object.create({ ...photo, url }) as Photo),
        );

        return Promise.all(photosPromise).then(photos => resolve(photos));
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

export function likePhoto(photoId: string, userId: string) {
  return database
    .ref('gear-likes')
    .child(photoId)
    .child(userId)
    .transaction(like => {
      if (like) {
        return null;
      }
      return ServerValue.TIMESTAMP;
    });
}

export function commentPhoto(id: string, content: string, { uid, name }: CurrentUser) {
  const comment = new Comment(new Author(uid, name), content, ServerValue.TIMESTAMP);
  return database
    .ref('gear-comments')
    .child(id)
    .push()
    .set(comment);
}

export function deletePhotoComment(photoId: string, commentId: string) {
  return database
    .ref('gear-comments')
    .child(photoId)
    .child(commentId)
    .set(null);
}

export function getPhotos(from: number, to: number): Promise<FirebasePhoto[]> {
  return new Promise<FirebasePhoto[]>((resolve, reject) => {
    database
      .ref('gears')
      .startAt(from)
      .endAt(to)
      .once('value')
      .then(snapshots => {
        const firebasePhotos = new Array<FirebasePhoto>(snapshots.numChildren());
        snapshots.forEach((snapshot: DataSnapshot) => {
          const firebasePhoto = snapshot.val();
          firebasePhotos.push(firebasePhoto);
        });
        return firebasePhotos;
      })
      .catch(e => {
        reject(e);
      });
  });
}

export async function createPhoto(imageBlob: Blob | File, description: string, author: Author,
                                  width: number, height: number): Promise<string> {
  console.log(imageBlob);
  console.log(description);
  console.log(author);
  console.log(width);
  console.log(height);
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null')
  }
  if (!description) {
    throw new Error('Description can not be empty')
  }
  if (!imageBlob) {
    throw new Error('Image can not be empty')
  }
  if (!width || !height) {
    throw new Error('Width and height can not be null')
  }
  const uid = database
    .ref('gears')
    .push()
    .key;

  if (uid == null) {
    throw new Error('Could not push new photo to db')
  }
  try {
    await database.ref(`gears/${uid}`)
      .set({
        uid,
        author,
        description,
        status: OnlineStatus.ONLINE_PUBLIC,
        creationTime: ServerValue.TIMESTAMP,
        lastTimeModified: ServerValue.TIMESTAMP,
        width,
        height,
        reports: 0,
      });

    await uploadPhoto(imageBlob, uid);
    return uid;
  } catch (e) {
    database.ref(`gears/${uid}`).remove();
    throw e;
  }
}
