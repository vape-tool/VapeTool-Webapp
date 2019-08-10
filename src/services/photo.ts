import { database, storage } from '@/utils/firebase';
import { Photo, Photo as FirebasePhoto } from '@/types/photo';
import DataSnapshot = firebase.database.DataSnapshot;

export function getUserPhotos(uid: string): Promise<Photo[]> {
  return new Promise<Photo[]>((resolve, reject) => {
    database.ref('gears').orderByChild('author/uid').equalTo(uid).once('value')
      .then(snapshots => {
        const firebasePhotos: FirebasePhoto[] = [];
        snapshots.forEach((snapshot: DataSnapshot) => {
          const firebasePhoto = snapshot.val();
          firebasePhotos.push(firebasePhoto)
        });
        const photosPromise = firebasePhotos.map(photo => getPhotoUrl(photo.uid)
          .then(url => Object.create({ ...photo, url }) as Photo));

        return Promise.all(photosPromise).then(photos => resolve(photos))
      })
      .catch(e => {
        console.error(e);
        reject(e)
      });
  })
}

export function getPhotoUrl(uid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    storage.ref(`gears/images/${uid}.jpg`).getDownloadURL().then(url => {
      if (url) {
        resolve(url);
      } else {
        reject(new Error('User image not found'));
      }
    }).catch(e => reject(e));
  })
}
