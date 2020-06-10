import { Liquid } from '@vapetool/types';
import request from '@/utils/request';
import { auth, liquidsRef } from '@/utils/firebase';
import { UserModelState } from '@/models/user';

export async function calculateResults(liquid: Liquid): Promise<any> {
  if (!auth.currentUser) {
    throw Error('You are not logged in');
  }
  const idToken = await auth.currentUser!.getIdToken(false);
  return request.post('/api/calculator/liquid/results', { data: { liquid, idToken } });
}

export async function saveLiquid(liquid: Liquid, user: UserModelState) {
  const newObjectUid = await liquidsRef.push();
  const uid = newObjectUid.key;
  if (uid == null) {
    throw new Error('Could not push new post to db');
  }
  if (!user) {
    throw new Error('Author can not be null');
  }
  try {
    const newObject: Liquid = {
      ...liquid,
      author: {
        ...user,
      },
    };
    console.log(newObject);

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    await liquidsRef.child(uid).set(newObject);
    return uid;
  } catch (e) {
    liquidsRef.child(uid).remove();
    throw e;
  }
}
