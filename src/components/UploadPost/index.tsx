import React from 'react';
import { Editor, EditorState } from 'draft-js';
import { Button, Card, Input } from 'antd';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import {
  dispatchSetText,
  dispatchSetTitle,
  dispatchSubmit,
  SUBMIT_LINK,
  SUBMIT_POST,
} from '@/models/uploadPost';
import { ShareAltOutlined } from '@ant-design/icons/lib';
import { formatMessage, FormattedMessage, connect, Dispatch   } from 'umi';

interface UploadPostProps {
  currentUser?: CurrentUser;
  dispatch: Dispatch;
  type: 'post' | 'link';
}

const UploadPost: React.FC<UploadPostProps> = props => {
  const { dispatch, type } = props;
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatchSetTitle(dispatch, e.target.value);
  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    dispatchSetText(dispatch, e.target.value);
  const onPostClick = () => dispatchSubmit(dispatch, type === 'post' ? SUBMIT_POST : SUBMIT_LINK);

  return (
    <Card style={{ textAlign: 'center' }}>
      <Input
        placeholder={formatMessage({ id: type === 'post' ? 'misc.title' : 'misc.url' })}
        onChange={onTitleChange}
        style={{ marginBottom: 24 }}
      />
      <Input.TextArea
        allowClear
        placeholder={formatMessage({ id: 'misc.optionalText', defaultMessage: 'Text (Optional)' })}
        onChange={onTextChange}
      />
      <Editor editorState={editorState} onChange={setEditorState} />
      <Button type="primary" onClick={onPostClick}>
        <FormattedMessage id="user.actions.publishPost" defaultMessage="Publish post" />
        <ShareAltOutlined />
      </Button>
    </Card>
  );
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(UploadPost);
