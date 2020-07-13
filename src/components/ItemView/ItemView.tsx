import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Input, List, Menu, Modal } from 'antd';
import { likesRef, commentsRef } from '@/utils/firebase';
import { CurrentUser } from '@/app';
import { FormattedMessage, useIntl } from 'umi';
import firebase from 'firebase';
import { like, report, deleteItem, deleteComment, commentItem } from '@/services/operations';
import { LikeIconText } from '@/components/LikeIconText';
import { CommentIconText } from '@/components/CommentIconText';
import Dropdown from 'antd/es/dropdown';
import { UserPermission } from '@vapetool/types';
import { Liquid, Coil, Post, Link, Photo, Comment, ItemName } from '@/types';
import { DeleteOutlined, FlagOutlined, MoreOutlined } from '@ant-design/icons';
import { CommentView } from './CommentView';

export interface ItemViewProps<T> {
  item: T;
  displayCommentsLength: number;
  user: CurrentUser;
  what: ItemName;
  unselectItem: () => void;
}

export interface ItemViewState {
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
  draftComment: string;
  displayComments?: Comment[];
}

export function Actions<T extends Photo | Post | Link | Coil | Liquid>({
  what,
  item,
  user,
  displayCommentsLength,
  unselectItem,
}: ItemViewProps<T>) {
  const [draftComment, setDraftComment] = useState<string>('');
  const { displayComments, commentsCount } = useComments(what, item, user, displayCommentsLength);
  const inputRef = useRef<Input>(null);
  const { likedByMe, likesCount } = useLikes(what, item, user);
  const intl = useIntl();

  const onChangeCommentText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftComment(e.target.value);
  };
  const onLikeClick = () => like(what, item.uid, user.uid);
  const onReportClick = () => report(what, item.uid, user.uid);
  const submitComment = () => commentItem(what, draftComment, item.uid, user);

  const onReplyComment = (replyingComment: Comment) => {
    if (draftComment.trim().length === 0) {
      setDraftComment(`@${replyingComment.author.displayName.trim().replace(' ', '_')} `);
    } else {
      setDraftComment(
        `@${replyingComment.author.displayName.trim().replace(' ', '_')} ${draftComment}`,
      );
    }
    inputRef.current?.focus();
  };

  const onCommentClick = () => inputRef.current?.focus();

  const postComment = () => {
    commentItem(what, draftComment, item.uid, user);
    setDraftComment('');
  };

  const onDeleteClick = () => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'user.modalTitles.deletePost',
        defaultMessage: 'Are you sure to delete this post?',
      }),
      okText: intl.formatMessage({ id: 'misc.actions.delete', defaultMessage: 'Delete' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'misc.actions.cancel', defaultMessage: 'Cancel' }),
      onOk() {
        deleteItem(what, item.uid);
        unselectItem();
      },
    });
  };

  const onDeleteCommentClick = (comment: Comment) => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'user.modalTitles.deleteComment',
        defaultMessage: 'Are you sure to delete this comment?',
      }),
      okText: intl.formatMessage({ id: 'misc.actions.delete', defaultMessage: 'Delete' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'misc.actions.cancel', defaultMessage: 'Cancel' }),
      onOk() {
        deleteComment(what, comment.uid, item.uid);
        unselectItem();
      },
    });
  };

  const optionsMenu = (
    <Menu>
      <Menu.Item
        key="report"
        onClick={onReportClick}
        disabled={!user || user.uid === item.author.uid}
      >
        <FlagOutlined />
        <FormattedMessage id="user.actions.report" defaultMessage="Report" />
      </Menu.Item>

      <Menu.Item
        key="delete"
        onClick={onDeleteClick}
        disabled={
          !user ||
          (user.uid !== item.author.uid && user.permission < UserPermission.ONLINE_MODERATOR)
        }
      >
        <DeleteOutlined />
        <FormattedMessage id="misc.actions.delete" defaultMessage="Delete" />
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <List.Item
        style={{ maxWidth: 614 }}
        actions={[
          <LikeIconText
            onClick={onLikeClick}
            text={`${likesCount || 0}`}
            key="list-vertical-like-o"
            likedByMe={likedByMe}
          />,
          <CommentIconText
            onClick={onCommentClick}
            text={`${commentsCount || 0}`}
            key="list-vertical-message"
          />,
          <span>{moment(item.creationTime).fromNow()}</span>,
          <Dropdown overlay={optionsMenu}>
            <MoreOutlined />
          </Dropdown>,
        ]}
      />
      {displayComments && displayComments.length > 0 && (
        <List<Comment>
          size="small"
          rowKey={(comment) => comment.uid}
          dataSource={displayComments}
          renderItem={(comment) => (
            <CommentView
              user={user}
              comment={comment}
              onReply={onReplyComment}
              onDelete={onDeleteCommentClick}
            />
          )}
        />
      )}
      <Input
        ref={inputRef}
        onPressEnter={postComment}
        value={draftComment}
        onChange={onChangeCommentText}
        placeholder={intl.formatMessage({
          id: 'user.addComment',
          defaultMessage: 'Add new comment...',
        })}
        suffix={
          <a onClick={submitComment}>
            <FormattedMessage id="user.actions.post" defaultMessage="Post" />
          </a>
        }
      />
    </>
  );
}

function useLikes(what: ItemName, item: Photo | Post | Link | Coil | Liquid, user: CurrentUser) {
  const [likesCount, setLikesCount] = useState<number | undefined>();
  const [likedByMe, setLikedByMe] = useState<boolean | undefined>(false);

  useEffect(() => {
    const ref = likesRef(what).child(item.uid);
    const listener = ref.on('value', (snapshot: firebase.database.DataSnapshot) => {
      setLikesCount(snapshot.numChildren());
      snapshot.forEach((snap) => {
        if (user !== undefined && snap.key === user.uid) {
          setLikedByMe(true);
        }
      });
    });
    return () => ref.off('value', listener);
  }, [item.uid]);

  return { likedByMe, likesCount };
}

function useComments(
  what: ItemName,
  item: Photo | Post | Link | Coil | Liquid,
  user: CurrentUser,
  displayCommentsLength: number,
) {
  const [commentsCount, setCommentsCount] = useState<number | undefined>();
  const [displayComments, setDisplayComments] = useState<Comment[]>([]);

  useEffect(() => {
    const ref = commentsRef(what).child(item.uid);
    const listener = ref.on('value', (snapshot: firebase.database.DataSnapshot) => {
      setCommentsCount(snapshot.numChildren());
      const comments: Comment[] = [];
      snapshot.forEach((snap) => {
        comments.push({ ...snap.val(), uid: snap.key });
      });
      setDisplayComments(comments.slice(Math.max(comments.length - displayCommentsLength, 0)));
    });
    return () => ref.off('value', listener);
  }, [item.uid]);

  return { commentsCount, displayComments };
}
