import { request } from 'umi';
import { auth } from '@/utils/firebase';
import { Liquid } from '@vapetool/types';

export async function calculateResults(liquid: Liquid): Promise<any> {
  if (!auth.currentUser) {
    throw Error('You are not logged in');
  }
  const idToken = await auth.currentUser!.getIdToken(false);
  return request('/api/calculator/liquid/results', { method: 'POST', data: { liquid, idToken } });
}
