import {
  batteriesStorageRef,
  coilsStorageRef,
  photosStorageRef,
  StorageReference,
  usersStorageRef,
} from '@/utils/firebase';

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
      return getDownloadUrl(photosStorageRef, uid);
    case 'coil':
      return getDownloadUrl(coilsStorageRef, uid);
    case 'user':
      return getDownloadUrl(usersStorageRef, uid);
    case 'battery':
      return getDownloadUrl(batteriesStorageRef, uid);
    default:
      throw Error('Unsupported type');
  }
}

function getDownloadUrl(
  storageRef: StorageReference,
  uid: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    storageRef
      .child(`${uid}.jpg`)
      .getDownloadURL()
      .then(url => {
        resolve(url);
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

export async function uploadPhoto(imageBlob: Blob | File, uid: string) {
  return photosStorageRef.child(`${uid}.jpg`).put(imageBlob);
}

export async function uploadAvatar(imageBlob: Blob | File, uid: string) {
  return usersStorageRef.child(`${uid}.jpg`).put(imageBlob);
}
