import Link from '@/types/Link';
import Post from '@/types/Post';
import Photo from '@/types/Photo';

export type Item = Photo | Post | Link;

export enum ItemName {
  PHOTO = 'photo',
  POST = 'post',
  LINK = 'link',
  COIL = 'coil',
  LIQUID = 'liquid',
}
