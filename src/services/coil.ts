import { Properties, Coil } from '@vapetool/types';
import { request } from 'umi';
import { auth, callFirebaseFunction } from '@/utils/firebase';

export async function calculateForWraps(coil: Coil): Promise<Coil> {
  return callFirebaseFunction<Coil>('calculateForWraps', { coil });
}

export function calculateForResistance(coil: Coil): Promise<Coil> {
  return callFirebaseFunction<Coil>('calculateForResistance', { coil });
}

export function calculateProperties(coil: Coil, baseVoltage: number): Promise<Properties> {
  return callFirebaseFunction<Properties>('calculateForProperties', { coil, baseVoltage });
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
