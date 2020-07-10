import {
  batteriesStorageRef,
  coilsStorageRef,
  photosStorageRef,
  usersStorageRef,
} from '@/utils/firebase';

export enum ImageType {
  USER = 'user',
  PHOTO = 'gear',
  COIL = 'coil',
  BATTERY = 'battery',
}

export function getBatteryUrl(uid: string): Promise<string | undefined> {
  return getImageUrl(ImageType.BATTERY, uid);
}

export function getPhotoUrl(uid: string): Promise<string | undefined> {
  return getImageUrl(ImageType.PHOTO, uid);
}

export function getAvatarUrl(uid: string): Promise<string | undefined> {
  return getImageUrl(ImageType.USER, uid);
}

export function getCoilUrl(uid: string): Promise<string | undefined> {
  return getImageUrl(ImageType.COIL, uid);
}

export function getImageUrl(type: ImageType, uid: string): Promise<string | undefined> {
  switch (type) {
    case ImageType.PHOTO:
      return getDownloadUrl(photosStorageRef, uid);
    case ImageType.COIL:
      return getDownloadUrl(coilsStorageRef, uid);
    case ImageType.USER:
      return getDownloadUrl(usersStorageRef, uid);
    case ImageType.BATTERY:
      return getDownloadUrl(batteriesStorageRef, uid);
    default:
      throw Error('Unsupported type');
  }
}

function getDownloadUrl(
  storageRef: firebase.storage.Reference,
  uid: string,
): Promise<string | undefined> {
  return new Promise((resolve) => {
    storageRef
      .child(`${uid}.jpg`)
      .getDownloadURL()
      .then((url) => {
        resolve(url);
      })
      .catch(() => {
        resolve(undefined);
      });
  });
}

export async function uploadPhoto(imageBlob: Blob | File, uid: string) {
  return photosStorageRef.child(`${uid}.jpg`).put(imageBlob);
}

export async function uploadAvatar(imageBlob: Blob | File, uid: string) {
  return usersStorageRef.child(`${uid}.jpg`).put(imageBlob);
}
