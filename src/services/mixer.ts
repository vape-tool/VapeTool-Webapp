import { Mixable, MixResult } from '@vapetool/types';
import { request } from 'umi';
import { auth } from '@/utils/firebase';

export async function calculate(mixable1: Mixable, mixable2: Mixable): Promise<MixResult> {
  try {
    if (!auth.currentUser) {
      throw Error('You are not logged in');
    }
    const idToken = await auth.currentUser!.getIdToken(false);
    console.log({ data: JSON.stringify({ mixable1, mixable2, idToken }) });
    return request(`/api/calculator/mixer/mix`, {
      method: 'POST',
      data: { mixable1, mixable2, idToken },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
