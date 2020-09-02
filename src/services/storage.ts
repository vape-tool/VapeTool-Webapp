import {
  batteriesStorageRef,
  coilsStorageRef,
  photosStorageRef,
  usersStorageRef,
  storage,
} from '@/utils/firebase';
import { remoteConfig } from 'firebase';

export enum ImageType {
  USER = 'user',
  PHOTO = 'gear',
  COIL = 'coil',
  BATTERY = 'battery',
  BANNER = 'banner',
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

export function getBannerUrl(bannerProperties: BannerProperties): Promise<string | undefined> {
  return getImageUrl(ImageType.BANNER, bannerProperties.imageGs);
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
    case ImageType.BANNER:
      return getDownloadUrlByUri(uid);
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

function getDownloadUrlByUri(uri: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    storage()
      .refFromURL(uri)
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

export interface BannerProperties {
  name: string;
  linkUrl: string;
  imageGs: string;
}

export async function getAdImageProperties(parameterKey: string): Promise<BannerProperties> {
  return JSON.parse(remoteConfig().getValue(parameterKey).asString()) as BannerProperties;
}
