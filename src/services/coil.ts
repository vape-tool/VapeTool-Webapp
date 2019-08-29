import { Coil } from '@vapetool/types';
import request from '@/utils/request';

export async function calculateForWraps(coil: Coil): Promise<any> {
  return request.post('/api/calculator/coil/wraps', { data: { coil } });
}

export async function calculateForResistance(coil: Coil): Promise<any> {
  return request.post('/api/calculator/coil/resistance', { data: { coil } });
}

export async function getSweetSpot(coil: Coil): Promise<any> {
  return request.post('/api/calculator/coil/sweetSpot', { data: { coil } });
}
