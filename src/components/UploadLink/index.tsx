import React from 'react';
import { Editor, EditorState } from 'draft-js';
import { Button, Card, Input } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons/lib';
import { useIntl, FormattedMessage, useModel } from 'umi';
import { CurrentUser } from '@/app';

const UploadLink: React.FC = () => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const { setUrl, setText, submitLink } = useModel('uploadLink');

  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser as CurrentUser;

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
  const onPostClick = () => submitLink(currentUser);

  return (
    <Card style={{ textAlign: 'center' }}>
      <Input
        placeholder={useIntl().formatMessage({ id: 'misc.url' })}
        onChange={onUrlChange}
        style={{ marginBottom: 24 }}
      />
      <Input.TextArea
        allowClear
        placeholder={useIntl().formatMessage({
          id: 'misc.optionalText',
          defaultMessage: 'Text (Optional)',
        })}
        onChange={onTextChange}
      />
      <Editor editorState={editorState} onChange={setEditorState} />
      <Button type="primary" onClick={onPostClick}>
        <FormattedMessage id="user.actions.publishLink" defaultMessage="Publish link" />{' '}
        <ShareAltOutlined />
      </Button>
    </Card>
  );
};

export default UploadLink;
