import React from 'react';
import { connect } from 'dva';
import { Editor, EditorState } from 'draft-js';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

interface UploadPostProps {
  currentUser?: CurrentUser;
}

const UploadPost: React.FC<UploadPostProps> = props => {
  const { currentUser } = props;
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  return <Editor editorState={editorState} onChange={setEditorState} />;
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(UploadPost);
