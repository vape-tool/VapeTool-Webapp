import { Photo as FirebasePhoto } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { Photo } from '@/types/photo';
import { getImageUrl } from '@/services/storage';

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
