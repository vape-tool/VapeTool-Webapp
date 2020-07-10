import { Properties } from '@vapetool/types';
import { request } from 'umi';
import { auth } from '@/utils/firebase';
import { Coil } from '@/types';

export function calculateForWraps(coil: Coil): Promise<Coil> {
  return sendRequest('wraps', coil);
}

export function calculateForResistance(coil: Coil): Promise<Coil> {
  return sendRequest('resistance', coil);
}

export function calculateProperties(coil: Coil, baseVoltage: number): Promise<Properties> {
  return sendRequest('properties', coil, baseVoltage);
}

export async function sendRequest<T>(
  calcFor: 'wraps' | 'resistance' | 'properties',
  coil: Coil,
  baseVoltage?: number,
): Promise<T> {
  try {
    if (!auth.currentUser) {
      throw Error('You are not logged in');
    }
    const idToken = await auth.currentUser!.getIdToken(false);
    return await request(`/api/calculator/coil/${calcFor}`, {
      method: 'POST',
      data: { coil, idToken, baseVoltage },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
