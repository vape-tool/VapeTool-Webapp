import React from 'react';
import { Editor, EditorState } from 'draft-js';
import { Col, Input, Card, Button } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

interface UploadPostProps {
  currentUser?: CurrentUser;
  dispatch: Dispatch;
}

const UploadPost: React.FC<UploadPostProps> = props => {
  const { currentUser, dispatch } = props;
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const onPostClick = () => {
    dispatch({
      type: 'upload/uploadPost',
    });
  };

  return (
    <Card>
      <Col>
        <Input placeholder="Title" />
        <br />
        <br />
        <Input.TextArea allowClear placeholder="Text (optional)" />
        <Editor editorState={editorState} onChange={setEditorState} />
        <Button type="primary" onClick={onPostClick}>
          Post
        </Button>
      </Col>
    </Card>
  );
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(UploadPost);
