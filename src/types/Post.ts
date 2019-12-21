import { Post as FirebasePost } from '@vapetool/types';
import Typable from '@/types/Typable';

export default interface Post extends FirebasePost, Typable {
  readonly lastTimeModified: number;
  readonly creationTime: number;
}
