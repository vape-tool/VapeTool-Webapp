import { Coil } from '@vapetool/types';
import { addCoil } from '@/services/coil';

export default function saveCoil(coil: Coil) {
  addCoil(coil);
}
