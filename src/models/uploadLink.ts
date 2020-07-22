import { history } from 'umi';
import { CurrentUser } from '@/app';
import { useState } from 'react';
import { message } from 'antd';
import { createLink } from '@/services/items';
import { Author } from '@vapetool/types';

export default function UploadLink() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const reset = () => {
    setUrl('');
    setText('');
  };
  const submitLink = async (currentUser: CurrentUser) => {
    const author: Author = {
      uid: currentUser.uid,
      displayName: currentUser.display_name,
    };
    if (!url.startsWith('http')) {
      setUrl(`https://${url}`);
    }
    try {
      createLink(text, url, author);
      message.success('Sucessfully published link');
      reset();
      history.replace({ pathname: '/cloud' });
    } catch (e) {
      message.error(e.message);
    }
  };
  return {
    url,
    setUrl,
    text,
    setText,
    submitLink,
  };
}
