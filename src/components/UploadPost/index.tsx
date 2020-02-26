import React from 'react';
import { Editor, EditorState } from 'draft-js';
import { Button, Card, Col, Input } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import {
  dispatchSetText,
  dispatchSetTitle,
  dispatchSubmit,
  SUBMIT_LINK,
  SUBMIT_POST,
} from '@/models/uploadPost';

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
    <Card>
      <Col>
        <Input placeholder={type === 'post' ? 'Title' : 'URL'} onChange={onTitleChange} />
        <br />
        <br />
        <Input.TextArea allowClear placeholder="Text (optional)" onChange={onTextChange} />
        <Editor editorState={editorState} onChange={setEditorState} />
        <Button type="primary" onClick={onPostClick}>
          Post
        </Button>
      </Col>
    </Card>
  );
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(UploadPost);
