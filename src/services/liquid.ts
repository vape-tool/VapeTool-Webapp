import { auth, callFirebaseFunction } from '@/utils/firebase';
import { Liquid, Result } from '@vapetool/types';

export async function calculateResults(liquid: Liquid): Promise<Result[]> {
  if (!auth.currentUser) {
    throw Error('You are not logged in');
  }
  try {
    return await callFirebaseFunction<Result[]>('calculateForMix', { liquid });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
