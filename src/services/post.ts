import { Author } from '@vapetool/types';
import { database } from '@/utils/firebase';

export async function createPost(
  title: string,
  description: string,
  author: Author,
): Promise<string> {
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null');
  }
  if (!title) {
    throw new Error('Title can not be empty');
  }

  const newObjectUid = await database.ref('posts').push();
  const uid = newObjectUid.key;

  if (uid == null) {
    throw new Error('Could not push new photo to db');
  }
  try {
    const newObject = {
      uid,
      author,
      description,
      status: OnlineStatus.ONLINE_PUBLIC,
      creationTime: ServerValue.TIMESTAMP,
      lastTimeModified: ServerValue.TIMESTAMP,
      width,
      height,
      reports: 0,
    };
    console.log('uploading photo');
    console.dir(newObject);

    // It must be published to storage prior to database because db will trigger
    // update listener before storage is completed
    await uploadPhoto(imageBlob, uid);
    await database.ref(`gears/${uid}`).set(newObject);
    return uid;
  } catch (e) {
    database.ref(`gears/${uid}`).remove();
    throw e;
  }
}
