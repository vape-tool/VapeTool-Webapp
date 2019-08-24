import { storage } from '@/utils/firebase';

export type ImageType = 'user' | 'gear' | 'photo' | 'coil' | 'battery';

export function getBatteryUrl(uid: string): Promise<string> {
  return getImageUrl('battery', uid);
}

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
    case 'battery':
      return getDownloadUrl('batteries', uid);
    default:
      throw Error('Unsupported type');
  }
}

function getDownloadUrl(
  type: 'users' | 'coils' | 'gears' | 'batteries',
  uid: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    storage
      .ref(`${type}/images/${uid}.jpg`)
      .getDownloadURL()
      .then(url => {
        if (url) {
          resolve(url);
        } else {
          reject(new Error('Image not found'));
        }
      })
      .catch(e => reject(e));
  });
}
