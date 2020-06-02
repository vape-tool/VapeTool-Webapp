import { Mixable } from '@vapetool/types';
import request from '@/utils/request';
import { auth } from '@/utils/firebase';

export function calculate(mixable1: Partial<Mixable>, mixable2: Partial<Mixable>) {
  return sendRequest(mixable1, mixable2);
}

export async function sendRequest<T>(
  mixable1: Partial<Mixable>,
  mixable2: Partial<Mixable>,
): Promise<T> {
  try {
    if (!auth.currentUser) {
      throw Error('You are not logged in');
    }
    const idToken = await auth.currentUser!.getIdToken(false);
    console.log({ data: JSON.stringify({ mixable1, mixable2, idToken }) });
    return await request.post(`/api/calculator/mixer/mix`, {
      data: { mixable1, mixable2, idToken },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
