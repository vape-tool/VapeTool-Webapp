import request from '@/utils/request';
import { auth } from '@/utils/firebase';
import { Liquid } from '@/types';

export async function calculateResults(liquid: Liquid): Promise<any> {
  if (!auth.currentUser) {
    throw Error('You are not logged in');
  }
  const idToken = await auth.currentUser!.getIdToken(false);
  return request.post('/api/calculator/liquid/results', { data: { liquid, idToken } });
}
