import { Input, List, Menu, Modal } from 'antd';
import React from 'react';
import { DataSnapshot, DatabaseReference, likesRef, commentsRef } from '@/utils/firebase';
import { CurrentUser } from '@/models/user';
import { dispatchSelectItem } from '@/models/preview';
import { Dispatch } from 'redux';
import {
  dispatchComment,
  dispatchDelete,
  dispatchDeleteComment,
  dispatchLike,
  dispatchReport,
} from '@/models/operations';
import CommentView from '@/components/ItemView/CommentView';
import { LikeIconText } from '@/components/LikeIconText';
import { CommentIconText } from '@/components/CommentIconText';
import moment from 'moment';
import Dropdown from 'antd/es/dropdown';
import { UserPermission } from '@vapetool/types';
import { Liquid, Coil, Post, Link, Photo, Comment, ItemName } from '@/types';
import { DeleteOutlined, FlagOutlined, MoreOutlined } from '@ant-design/icons';

export interface ItemViewProps<T> {
  item: T;
  dispatch: Dispatch;
  displayCommentsLength: number;
  user?: CurrentUser;
}

export interface ItemViewState {
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
  draftComment: string;
  displayComments?: Comment[];
}

// TODO refactor to functional component
export abstract class ItemView<
  T extends Photo | Post | Link | Coil | Liquid,
  Props extends ItemViewProps<T> = ItemViewProps<T>,
  State extends ItemViewState = ItemViewState
> extends React.Component<Props, State> {
  protected inputRef?: any = undefined;

  protected likesRef?: DatabaseReference = undefined;

  private commentsRef?: DatabaseReference = undefined;

  constructor(props: Readonly<Props>) {
    super(props);
    // @ts-ignore
    this.state = {
      commentsCount: undefined,
      displayComments: undefined,
      draftComment: '',
      likedByMe: undefined,
      likesCount: undefined,
    };
  }

  componentDidMount(): void {
    const { item } = this.props;
    this.likesRef = likesRef(this.what).child(item.uid);
    this.commentsRef = commentsRef(this.what).child(item.uid);

    this.listenLikes();
    this.listenComments();
  }

  componentWillUnmount(): void {
    if (this.likesRef) {
      this.likesRef.off();
    }
    if (this.commentsRef) {
      this.commentsRef.off();
    }
  }

  CommentInput = () => (
    <Input
      ref={ref => {
        this.inputRef = ref;
      }}
      onPressEnter={this.postComment}
      value={this.state.draftComment}
      onChange={this.onChangeCommentText}
      placeholder="Add a comment..."
      suffix={<a onClick={this.postComment}>Post</a>}
    />
  );

  CommentsList = () => (
    <List<Comment>
      size="small"
      rowKey={comment => comment.uid}
      dataSource={this.state.displayComments}
      renderItem={comment => (
        <CommentView
          comment={comment}
          onReply={this.onReplyComment}
          onDelete={this.onDeleteCommentClick}
        />
      )}
    />
  );

  Actions = () => {
    const optionsMenu = (
      <Menu>
        <Menu.Item
          key="report"
          onClick={this.onReportClick}
          disabled={!this.props.user || this.props.user.uid === this.props.item.author.uid}
        >
          <FlagOutlined />
          Report
        </Menu.Item>
        <Menu.Item
          key="delete"
          onClick={this.onDeleteClick}
          disabled={
            !this.props.user ||
            (this.props.user.uid !== this.props.item.author.uid &&
              this.props.user.permission < UserPermission.ONLINE_MODERATOR)
          }
        >
          <DeleteOutlined />
          Delete
        </Menu.Item>
      </Menu>
    );
    return (
      <List.Item
        style={{ maxWidth: 614 }}
        actions={[
          <LikeIconText
            onClick={this.onLikeClick}
            text={`${this.state.likesCount || 0}`}
            key="list-vertical-like-o"
            likedByMe={this.state.likedByMe}
          />,
          <CommentIconText
            onClick={this.onCommentClick}
            text={`${this.state.commentsCount || 0}`}
            key="list-vertical-message"
          />,
          <span>{moment(this.props.item.creationTime).fromNow()}</span>,
          <Dropdown overlay={optionsMenu}>
            <MoreOutlined />
          </Dropdown>,
        ]}
      />
    );
  };

  protected onChangeCommentText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ draftComment: e.target.value });
  };

  protected onReplyComment = (comment: Comment) => {
    this.setState({ draftComment: `@${comment.author.displayName.trim().replace(' ', '_')} ` });
    this.inputRef.focus();
  };

  protected onCommentClick = () => this.inputRef.focus();

  protected onSelectItem = () => dispatchSelectItem(this.props.dispatch, this.props.item);

  protected onLikeClick = () => dispatchLike(this.props.dispatch, this.what, this.props.item.uid);

  protected onReportClick = () =>
    dispatchReport(this.props.dispatch, this.what, this.props.item.uid);

  protected postComment = () => {
    dispatchComment(this.props.dispatch, this.what, this.state.draftComment, this.props.item.uid);
    this.setState({ draftComment: '' });
  };

  protected onDeleteClick = () => {
    const { what } = this;
    const { dispatch, item } = this.props;
    Modal.confirm({
      title: 'Are you sure delete this photo ?',
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatchDelete(dispatch, what, item.uid);
        dispatchSelectItem(dispatch, undefined);
      },
    });
  };

  protected onDeleteCommentClick = (comment: Comment) => {
    const { what } = this;
    const { dispatch, item } = this.props;
    Modal.confirm({
      title: 'Are you sure delete this comment ?',
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatchDeleteComment(dispatch, what, comment.uid, item.uid);
        dispatchSelectItem(dispatch, undefined);
      },
    });
  };

  private listenLikes = () =>
    this.likesRef &&
    this.likesRef.on('value', (snapshot: DataSnapshot) => {
      this.setState({ likesCount: snapshot.numChildren() });
      let likedByMe = false;
      snapshot.forEach(snap => {
        if (this.props.user !== undefined && snap.key === this.props.user.uid) {
          likedByMe = true;
        }
      });

      this.setState({ likedByMe });
    });

  private listenComments = () =>
    this.commentsRef &&
    this.commentsRef.on('value', (snapshot: DataSnapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach(snap => {
        comments.push({ ...snap.val(), uid: snap.key });
      });
      this.setState({
        commentsCount: snapshot.numChildren(),
        displayComments: comments.slice(
          Math.max(comments.length - this.props.displayCommentsLength, 0),
        ),
      });
    });

  abstract what: ItemName;
}
