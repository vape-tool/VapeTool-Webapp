import { Liquid } from '@vapetool/types';
import { UserModelState } from '@/models/user';
import { saveLiquid } from '@/services/liquid';

export default function addLiquid(liquid: Liquid, user: UserModelState) {
  saveLiquid(liquid, user);
}
