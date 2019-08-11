import { storage } from '@/utils/firebase';

export type ImageType = 'user' | 'gear' | 'photo' | 'coil';

export function getPhotoUrl(uid: string): Promise<string> {
  return getImageUrl('photo', uid);
}

export function getAvatarUrl(uid: string): Promise<string> {
  return getImageUrl('user', uid);
}

export function getCoilUrl(uid: string): Promise<string> {
  return getImageUrl('coil', uid);
}

export function getImageUrl(type: ImageType, uid: string): Promise<string> {
  switch (type) {
    case 'photo':
      return getDownloadUrl('gears', uid);
    case 'coil':
      return getDownloadUrl('coils', uid);
    case 'user':
      return getDownloadUrl('users', uid);
    default:
      throw Error('Unsupported type');
  }
}

function getDownloadUrl(type: 'users' | 'coils' | 'gears', uid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    storage
      .ref(`${type}/images/${uid}.jpg`)
      .getDownloadURL()
      .then(url => {
        if (url) {
          resolve(url);
        } else {
          reject(new Error('User image not found'));
        }
      })
      .catch(e => reject(e));
  });
}
