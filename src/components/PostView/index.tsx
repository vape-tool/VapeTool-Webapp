import { Card, Icon, Input, List, Menu, Modal, Typography } from 'antd';
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Post, UserPermission } from '@vapetool/types';
import Dropdown from 'antd/es/dropdown';
import FirebaseImage from '@/components/StorageAvatar';
import { Comment } from '@/types/comment';
import { database, DataSnapshot, Reference } from '@/utils/firebase';
import { ConnectState } from '@/models/connect';
import CommentView from '@/components/CommentView';
import styles from './index.less';
import { CurrentUser } from '@/models/user';

interface PostViewProps {
  post: Post;
  dispatch: Dispatch;
  displayCommentsLength: number;
  user?: CurrentUser;
}

interface PostViewState {
  // src?: string;
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
  comment: string;
  displayComments?: Comment[];
}

class PostView extends React.Component<PostViewProps, PostViewState> {
  state: PostViewState = {
    // src: undefined,
    likesCount: undefined,
    likedByMe: undefined,
    commentsCount: undefined,
    comment: '',
    displayComments: undefined,
  };

  private inputRef?: any = undefined;

  private likesRef?: Reference = undefined;

  private commentsRef?: Reference = undefined;

  componentDidMount(): void {
    const { post } = this.props;
    // getPostUrl(post.uid).then(src => this.setState({ src }));

    this.likesRef = database.ref('post-likes').child(post.uid);
    this.commentsRef = database.ref('post-comments').child(post.uid);

    this.listenPostLikes();
    this.listenPostComments();
  }

  componentWillUnmount(): void {
    if (this.likesRef) {
      this.likesRef.off();
    }
    if (this.commentsRef) {
      this.commentsRef.off();
    }
  }

  onChangeCommentText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: e.target.value });
  };

  postComment = () => {
    this.props.dispatch({
      type: 'cloud/commentPost',
      payload: { comment: this.state.comment, postId: this.props.post.uid },
    });
  };

  onReplyComment = (comment: Comment) => {
    this.setState({ comment: `@${comment.author.displayName.trim().replace(' ', '_')} ` });
  };

  selectItem = () =>
    this.props.dispatch({
      type: 'cloud/selectItem',
      item: this.props.post,
    });

  render() {
    const LikeIconText = ({
                            type,
                            text,
                            onClick,
                          }: {
      type: string;
      text: string;
      onClick: any;
    }) => (
      <span>
        <Icon
          onClick={onClick}
          type={type}
          theme={this.state.likedByMe ? 'filled' : 'outlined'}
          className={this.state.likedByMe ? styles.liked : ''}
          style={{ marginRight: 8 }}
        />
        {text}
      </span>
    );
    const CommentIconText = (
      {
        type,
        text,
        onClick,
      }: {
        type: string;
        text: string;
        onClick: any;
      }) => (
      <span>
        <Icon onClick={onClick} type={type} style={{ marginRight: 8 }}/>
        {text}
      </span>
    );
    const { post, dispatch, user } = this.props;
    const { likesCount, commentsCount, comment, displayComments } = this.state;

    const optionsMenu = (
      <Menu>
        <Menu.Item key="report" onClick={this.onReportClick}>
          <Icon type="flag"/>
          Report
        </Menu.Item>
        <Menu.Item key="delete" onClick={() => this.onDeleteClick(post.uid, dispatch)}
                   disabled={!user
                   || (user.uid !== post.author.uid
                     && user.permission < UserPermission.ONLINE_MODERATOR)}>
          <Icon type="delete"/>
          Delete
        </Menu.Item>
      </Menu>
    );

    return (
      <Card
        style={{ maxWidth: 614, margin: 'auto' }}
        className={styles.card}
        hoverable
        onClick={this.selectItem}
      >
        <Card.Meta
          avatar={<FirebaseImage type="user" id={post.author.uid}/>}
          title={<Typography.Text>{post.title}</Typography.Text>}
          description={<Typography.Text>{post.text}</Typography.Text>}
        />
        <List.Item
          style={{ maxWidth: 614 }}
          actions={[
            <LikeIconText
              onClick={this.onLikeClick}
              type="like-o"
              text={`${likesCount || 0}`}
              key="list-vertical-like-o"
            />,
            <CommentIconText
              onClick={this.onCommentClick}
              type="message"
              text={`${commentsCount || 0}`}
              key="list-vertical-message"
            />,
            <span>{moment(post.creationTime).fromNow()}</span>,
            <Dropdown overlay={optionsMenu}>
              <Icon type="more"/>
            </Dropdown>,
          ]}>
        </List.Item>

        {displayComments && displayComments.length > 0 && (
          <List<Comment>
            size="small"
            rowKey={item => item.uid}
            dataSource={displayComments}
            renderItem={item => (
              <CommentView
                comment={item}
                post={post}
                dispatch={dispatch}
                onReply={this.onReplyComment}
              />
            )}
          />
        )}
        <Input
          ref={ref => {
            this.inputRef = ref;
          }}
          onPressEnter={this.postComment}
          value={comment}
          onChange={this.onChangeCommentText}
          placeholder="Add a comment..."
          suffix={<a onClick={this.postComment}>Post</a>}
        />
      </Card>
    );
  }

  private listenPostLikes = () =>
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

  private onLikeClick = () =>
    this.props.dispatch({
      type: 'cloud/likePost',
      postId: this.props.post.uid,
    });

  private onReportClick = () =>
    this.props.dispatch({
      type: 'cloud/reportPost',
      postId: this.props.post.uid,
    });

  private listenPostComments = () =>
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

  private onCommentClick = () => this.inputRef.focus();

  private onDeleteClick = (postUid: string, dispatch: Dispatch) => {
    Modal.confirm({
      title: 'Are you sure delete this post?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'clodu/deletePost',
          postId: postUid,
        });
      },
    });
  };
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(PostView);
