import { Mixable, MixResult } from '@vapetool/types';
import { auth, callFirebaseFunction } from '@/utils/firebase';

export async function calculate(mixable1: Mixable, mixable2: Mixable): Promise<MixResult> {
  try {
    if (!auth.currentUser) {
      throw Error('You are not logged in');
    }
    return await callFirebaseFunction('calculateForMix', { mixable1, mixable2 });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
