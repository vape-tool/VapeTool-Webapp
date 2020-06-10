import { Coil, Properties } from '@vapetool/types';
import request from '@/utils/request';
import { auth, coilsRef } from '@/utils/firebase';

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

export async function addCoil(coil: Coil) {
  const newObjectUid = await coilsRef.push();
  const uid = newObjectUid.key;
  if (uid == null) {
    throw new Error('Could not push new post to db');
  }
  if (!coil.author || !coil.author.uid || !coil.author.displayName) {
    throw new Error('Author can not be null');
  }
  try {
    const newObject: Coil = {
      ...coil,
    };

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    await coilsRef.child(uid).set(newObject);
    return uid;
  } catch (e) {
    coilsRef.child(uid).remove();
    throw e;
  }
}
