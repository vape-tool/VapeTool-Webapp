import React from 'react';
import { Editor, EditorState } from 'draft-js';
import { Button, Card, Col, Input } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

interface UploadPostProps {
  currentUser?: CurrentUser;
  dispatch: Dispatch;
  type: 'post' | 'link';
}

const UploadPost: React.FC<UploadPostProps> = props => {
  const { dispatch, type } = props;
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

  const onTextChange = (e: any) => {
    dispatch({
      type: 'uploadPost/setText',
      text: e.target.value,
    });
  };
  const onTitleChange = (e: any) => {
    dispatch({
      type: 'uploadPost/setTitle',
      title: e.target.value,
    });
  };
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const onPostClick = () => {
    dispatch({
      type: `uploadPost/submit${capitalize(type)}`,
    });
  };

  return (
    <Card>
      <Col>
        <Input placeholder={type === 'post' ? 'Title' : 'URL'} onChange={onTitleChange}/>
        <br/>
        <br/>
        <Input.TextArea allowClear
                        placeholder="Text (optional)"
                        onChange={onTextChange}/>
        <Editor editorState={editorState}
                onChange={setEditorState}/>
        <Button type="primary" onClick={onPostClick}>
          Post
        </Button>
      </Col>
    </Card>
  );
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(UploadPost);
