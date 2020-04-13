import { Photo as FirebasePhoto } from '@vapetool/types';
import {
  coilsRef,
  DatabaseReference,
  DataSnapshot,
  likesRef,
  linksRef,
  liquidsRef,
  photosRef,
  postsRef,
} from '@/utils/firebase';
import { getImageUrl, ImageType } from '@/services/storage';
import { Coil, ItemName, Link, Liquid, Photo, Post } from '@/types';

export async function getUserTotalContentCount(userId: string): Promise<number> {
  const promises = [linksRef, postsRef, photosRef].map(async ref => {
    const snapshots = await ref
      .orderByChild('author/uid')
      .equalTo(userId)
      .once('value');
    return snapshots.numChildren();
  });
  const counts = await Promise.all(promises);
  return counts.reduce((prevVal, currentVal) => prevVal + currentVal, 0);
}

export async function getUserTotalLikesCount(userUid: string): Promise<number> {
  const promises = [
    { ref: photosRef, contentLikesRef: likesRef(ItemName.PHOTO) },
    { ref: postsRef, contentLikesRef: likesRef(ItemName.POST) },
    { ref: linksRef, contentLikesRef: likesRef(ItemName.LINK) },
  ].map(({ ref, contentLikesRef }) => getLikesCountForContentType(userUid, ref, contentLikesRef));

  const counts = await Promise.all(promises);
  return counts.reduce((prevVal, currentVal) => prevVal + currentVal, 0);
}

async function getLikesCountForContentType(
  userUid: string,
  ref: DatabaseReference,
  contentLikesRef: DatabaseReference,
) {
  const snapshots = await ref
    .orderByChild('author/uid')
    .equalTo(userUid)
    .once('value');

  const promises = Array<Promise<number>>();
  snapshots.forEach(snapshot => {
    const uid = snapshot.key;
    if (!uid) {
      return;
    }
    const photoLikesPromise = contentLikesRef
      .child(uid)
      .once('value')
      .then(snaps => snaps.numChildren());
    promises.push(photoLikesPromise);
  });

  const counts = await Promise.all(promises);
  return counts.reduce((prevVal, currentVal) => prevVal + currentVal, 0);
}

export function getUserPhotos(uid: string): Promise<Photo[]> {
  return new Promise<Photo[]>((resolve, reject) => {
    photosRef
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
          getImageUrl(ImageType.PHOTO, photo.uid).then(url => ({ ...photo, url } as Photo)),
        );

        return Promise.all(photosPromise).then(photos => resolve(photos));
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

export async function getUserPosts(uid: string): Promise<Post[]> {
  const snapshots = await postsRef
    .orderByChild('author/uid')
    .equalTo(uid)
    .once('value');

  const firebasePosts: Post[] = [];
  snapshots.forEach((snapshot: DataSnapshot) => {
    const firebasePost = snapshot.val();
    firebasePosts.push(firebasePost);
  });

  return firebasePosts;
}

export async function getUserLinks(uid: string): Promise<Link[]> {
  const snapshots = await linksRef
    .orderByChild('author/uid')
    .equalTo(uid)
    .once('value');

  const firebaseLinks: Link[] = [];
  snapshots.forEach((snapshot: DataSnapshot) => {
    const firebaseLink = snapshot.val();
    firebaseLinks.push(firebaseLink);
  });

  return firebaseLinks;
}

export async function getUserCoils(uid: string): Promise<Coil[]> {
  const snapshots = await coilsRef
    .orderByChild('author/uid')
    .equalTo(uid)
    .once('value');

  const firebaseCoils: Coil[] = [];
  snapshots.forEach((snapshot: DataSnapshot) => {
    const firebaseCoil = snapshot.val();
    firebaseCoils.push(firebaseCoil);
  });

  return firebaseCoils;
}

export async function getUserLiquids(uid: string): Promise<Liquid[]> {
  const snapshots = await liquidsRef
    .orderByChild('author/uid')
    .equalTo(uid)
    .once('value');

  const firebaseLiquids: Liquid[] = [];
  snapshots.forEach((snapshot: DataSnapshot) => {
    const firebaseLiquid = snapshot.val();
    firebaseLiquids.push(firebaseLiquid);
  });

  return firebaseLiquids;
}
