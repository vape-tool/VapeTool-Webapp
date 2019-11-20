import { Post as FirebasePost } from '@vapetool/types';
import { Typable } from '@/types/Typable';

export interface Post extends FirebasePost, Typable {
  readonly lastTimeModified: number;
  readonly creationTime: number;
}
