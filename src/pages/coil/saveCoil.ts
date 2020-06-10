import { Coil } from '@vapetool/types';
import { addCoil } from '@/services/coil';
import { UserModelState } from '@/models/user';

export default function saveCoil(coil: Coil, user: UserModelState) {
  addCoil(coil, user);
}
