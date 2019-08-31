import { Button, Dropdown, Menu, Typography } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { UserPermission } from '@vapetool/types';
import { ConnectState, Dispatch } from '@/models/connect';
import FirebaseImage from '@/components/StorageAvatar';
import { Photo } from '@/types/photo';
import { Comment } from '@/types/comment';
import { CurrentUser } from '@/models/user';

interface CommentViewProps {
  user: CurrentUser
  comment: Comment
  photo: Photo
  dispatch: Dispatch
  onReply: (comment: Comment) => void;
}

const CommentView: React.FC<CommentViewProps> = props => {
  const { dispatch, onReply, user, photo, comment: { uid, content, author } } = props;

  const deleteComment = () => {
    dispatch({
      type: 'photo/deleteComment',
      payload: { photoId: photo.uid, commentId: uid },
    });
  };
  const menu = (
    <Menu>
      {(user.uid === author.uid || user.permission >= UserPermission.ONLINE_MODERATOR) &&
      <Menu.Item onClick={deleteComment} key="delete">Delete</Menu.Item>}
      <Menu.Item onClick={() => onReply(props.comment)} key="reply">Reply</Menu.Item>
    </Menu>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignContent: 'stretch' }}>
      <FirebaseImage type="user" id={author.uid} style={{ flexShrink: 0 }}/>
      <Typography.Text strong style={{ marginLeft: 8, flexShrink: 0 }}>
        {author.displayName}
      </Typography.Text>
      <span style={{ marginLeft: 8, flexGrow: 1, alignSelf: 'flex-start', textAlign: 'start' }}>{content}</span>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="link" icon="more"/>
      </Dropdown>
    </div>
  );
};


export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(CommentView)
