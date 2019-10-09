import { storage } from '@/utils/firebase';

export type ImageType = 'user' | 'gear' | 'photo' | 'coil' | 'battery';

export function getBatteryUrl(uid: string): Promise<string | null> {
  return getImageUrl('battery', uid);
}

export function getPhotoUrl(uid: string): Promise<string | null> {
  return getImageUrl('photo', uid);
}

export function getAvatarUrl(uid: string): Promise<string | null> {
  return getImageUrl('user', uid);
}

export function getCoilUrl(uid: string): Promise<string | null> {
  return getImageUrl('coil', uid);
}

export function getImageUrl(type: ImageType, uid: string): Promise<string | null> {
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
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    storage
      .ref(`${type}/images/${uid}.jpg`)
      .getDownloadURL()
      .then(url => {
        if (url) {
          resolve(url);
        } else {
          resolve(null);
        }
      })
      .catch(e => {
        console.error(e);
        resolve(null);
      });
  });
}
