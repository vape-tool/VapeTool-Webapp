import { Photo as FirebasePhoto } from '@vapetool/types';
import Typable from '@/types/Typable';

export default interface Photo extends FirebasePhoto, Typable {
  readonly url: string;
  readonly lastTimeModified: number;
  readonly creationTime: number;
  readonly timestamp: number;
}
