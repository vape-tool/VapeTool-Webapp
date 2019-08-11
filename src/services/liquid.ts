import { Liquid } from '@vapetool/types';
import request from '@/utils/request';

export async function calculateResults(liquid: Liquid): Promise<any> {
  return request.post('/api/calculateLiquidResults', { data: { liquid } });
}
