import { Author, Link, OnlineStatus, Post } from '@vapetool/types';
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
    const newObject: Post = {
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

export async function createLink(
  title: string,
  url: string,
  author: Author,
): Promise<string> {
  if (!author || !author.uid || !author.displayName) {
    throw new Error('Author can not be null');
  }
  if (!title) {
    throw new Error('Title can not be empty');
  }
  if (!url) {
    throw new Error('Url can not be empty');
  }
  const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  if (!url.match(expression)) {
    throw new Error('Invalid url');
  }

  const newObjectUid = await database.ref('links').push();
  const uid = newObjectUid.key;

  if (!uid) {
    throw new Error('Could not push new link to db');
  }
  const link: Link = {
    uid,
    title,
    url,
    author,
    creationTime: ServerValue.TIMESTAMP,
    lastTimeModified: ServerValue.TIMESTAMP,
    status: OnlineStatus.ONLINE_PUBLIC,
  };

  console.log('uploading link');
  console.dir(link);

  await database.ref(`links/${uid}`).set(link);
  return uid;
}
