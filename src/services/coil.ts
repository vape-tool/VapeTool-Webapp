import request from '@/utils/request';
import { Coil } from '@/types/coil';

export async function getResistance(coil: Coil): Promise<any> {
  return request.post('/api/getResistance', { data: coil });
}

export async function getWraps(coil: Coil): Promise<any> {
  return request.post('/api/getWraps', { data: coil });
}

export async function getSweetSpot(coil: Coil): Promise<any> {
  return request.post('/api/getSweetSpot', { data: coil });
}
