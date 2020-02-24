import { Button, Dropdown, Menu, Typography } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { UserPermission } from '@vapetool/types';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import FirebaseImage from '@/components/StorageAvatar';
import { Comment } from '@/types';
import { CurrentUser } from '@/models/user';
import { ImageType } from '@/services/storage';

interface CommentViewProps {
  user: CurrentUser;
  comment: Comment;
  dispatch: Dispatch;
  onReply: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

const CommentView: React.FC<CommentViewProps> = props => {
  const {
    comment: { content, author },
    user,
    onReply,
    onDelete,
  } = props;

  const deleteComment = () => onDelete(props.comment);

  const menu = (
    <Menu>
      {user !== undefined &&
        (user.uid === author.uid || user.permission >= UserPermission.ONLINE_MODERATOR) && (
          <Menu.Item onClick={deleteComment} key="delete">
            Delete
          </Menu.Item>
        )}
      <Menu.Item onClick={() => onReply(props.comment)} key="reply">
        Reply
      </Menu.Item>
    </Menu>
  );
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignContent: 'stretch' }}
    >
      <FirebaseImage type={ImageType.USER} size="small" style={{ flexShrink: 0 }} id={author.uid} />
      <Typography.Text strong style={{ marginLeft: 8, flexShrink: 0 }}>
        {author.displayName}
      </Typography.Text>
      <span style={{ marginLeft: 8, flexGrow: 1, alignSelf: 'flex-start', textAlign: 'start' }}>
        {content}
      </span>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="link" icon="more" />
      </Dropdown>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(CommentView);
