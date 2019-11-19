import { Author, OnlineStatus } from '@vapetool/types';
import { database, ServerValue } from '@/utils/firebase';

export async function createPost(
  title: string,
  text: string,
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
    throw new Error('Could not push new post to db');
  }
  try {
    const newObject = {
      uid,
      author,
      title,
      text,
      status: OnlineStatus.ONLINE_PUBLIC,
      creationTime: ServerValue.TIMESTAMP,
      lastTimeModified: ServerValue.TIMESTAMP,
    };
    console.log('uploading post');
    console.dir(newObject);

    await database.ref(`posts/${uid}`).set(newObject);
    return uid;
  } catch (e) {
    database.ref(`posts/${uid}`).remove();
    throw e;
  }
}
