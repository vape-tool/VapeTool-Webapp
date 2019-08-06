import { Coil } from '@vapetool/types';
import request from '@/utils/request';

export async function calculateForWraps(coil: Coil): Promise<any> {
  return request.post('/api/calculateForWraps', { data: { coil } });
}

export async function calculateForResistance(coil: Coil): Promise<any> {
  return request.post('/api/calculateForResistance', { data: { coil } });
}

export async function getSweetSpot(coil: Coil): Promise<any> {
  return request.post('/api/getSweetSpot', { data: { coil } });
}
