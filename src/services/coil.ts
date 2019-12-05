import { Coil, Properties } from '@vapetool/types';
import request from '@/utils/request';
import { auth } from '@/utils/firebase';

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
    return await request.post(`/api/calculator/coil/${calcFor}`, {
      data: { coil, idToken, baseVoltage },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
