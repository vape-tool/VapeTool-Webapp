import uuid from '@/utils/uuid';

export interface Author {
  uid: string;
  displayName: string;
}

export const LOCAL_AUTHOR: Author = {
  uid: uuid(),
  displayName: 'local',
};

export enum OnlineStatus {
  ONLINE_PRIVATE = 0,
  ONLINE_PENDING = 5,
  ONLINE_PUBLIC = 10
}

export interface Storeable {
  uid: string;
  author: Author;
  creationTime: number// millis
  lastTimeModified: number // millis
  status: OnlineStatus;
}

export function isCloudyValid(storeable: Storeable): boolean {
  return storeable.uid.length > 0 && storeable.creationTime > 0 && storeable.lastTimeModified > 0
}
