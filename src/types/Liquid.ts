import { Liquid as FirebaseLiquid } from '@vapetool/types';
import Typable from '@/types/Typable';

export default interface Liquid extends FirebaseLiquid, Typable {
  readonly lastTimeModified: number;
  readonly creationTime: number;
}
