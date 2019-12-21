import { Photo as FirebasePhoto } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { Photo } from '@/types/photo';
import { getImageUrl } from '@/services/storage';
import { Post } from '@/types/Post';
import { Link } from '@/types/Link';
import { Coil } from '@/types/Coil';
import { Liquid } from '@/types/Liquid';


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

export async function getUserPosts(uid: string): Promise<Post[]> {
  const snapshots = await database
    .ref('posts')
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
  const snapshots = await database
    .ref('links')
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
  const snapshots = await database
    .ref('coils')
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
  const snapshots = await database
    .ref('liquids')
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
