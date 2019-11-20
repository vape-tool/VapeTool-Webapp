import { Link as FirebaseLink } from '@vapetool/types';
import { Typable } from '@/types/Typable';

export interface Link extends FirebaseLink, Typable {
  readonly lastTimeModified: number;
  readonly creationTime: number;
}
