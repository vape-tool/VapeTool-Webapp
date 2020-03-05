import Photo from '@/types/Photo';
import Post from '@/types/Post';
import Link from '@/types/Link';
import Coil from '@/types/Coil';
import Liquid from '@/types/Liquid';

export type Item = Photo | Post | Link | Coil | Liquid;

export enum ItemName {
  PHOTO = 'photo',
  POST = 'post',
  LINK = 'link',
  COIL = 'coil',
  LIQUID = 'liquid',
}
