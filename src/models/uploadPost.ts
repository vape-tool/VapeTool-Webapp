import { history } from 'umi';
import { message } from 'antd';
import { Author } from '@vapetool/types';
import { createPost } from '@/services/items';
import { useState } from 'react';
import { CurrentUser } from '@/app';

export default function UploadPost() {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');

  const reset = () => {
    setTitle('');
    setText('');
  };

  const submitPost = async (currentUser: CurrentUser) => {
    const author: Author = {
      uid: currentUser.uid,
      displayName: currentUser.display_name,
    };
    try {
      await createPost(title, text, author);
      message.success('Successfully published post');
      reset();
      history.replace({ pathname: '/cloud' });
    } catch (e) {
      message.error(e.message);
    }
  };
  return {
    title,
    setTitle,
    text,
    setText,
    submitPost,
  };
}
