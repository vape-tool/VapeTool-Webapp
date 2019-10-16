import { Card, Icon, Input, List, message, Skeleton, Typography } from 'antd';
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import FirebaseImage from '@/components/StorageAvatar';
import { Photo } from '@/types/photo';
import { Comment } from '@/types/comment';
import { database, DataSnapshot, Reference } from '@/utils/firebase';
import { ConnectState } from '@/models/connect';
import CommentView from '@/components/CommentView';
import styles from './index.less';
import { CurrentUser } from '@/models/user';

interface PhotoViewProps {
  photo: Photo;
  dispatch: Dispatch;
  displayCommentsLength: number;
  user?: CurrentUser;
}

interface PhotoViewState {
  // src?: string;
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
  comment: string;
  displayComments?: Comment[];
}

class PhotoView extends React.Component<PhotoViewProps, PhotoViewState> {
  state: PhotoViewState = {
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
    const { photo } = this.props;
    // getPhotoUrl(photo.uid).then(src => this.setState({ src }));

    this.likesRef = database.ref('gear-likes').child(photo.uid);
    this.commentsRef = database.ref('gear-comments').child(photo.uid);

    this.listenPhotoLikes();
    this.listenPhotoComments();
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
      type: 'photo/commentPhoto',
      payload: { comment: this.state.comment, photoId: this.props.photo.uid },
    });
    message.info('Post');
  };

  onReplyComment = (comment: Comment) => {
    this.setState({ comment: `@${comment.author.displayName.trim().replace(' ', '_')} ` });
  };

  selectPhoto = () =>
    this.props.dispatch({
      type: 'photo/selectPhoto',
      photo: this.props.photo,
    });

  private listenPhotoLikes = () =>
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
      type: 'photo/likePhoto',
      photoId: this.props.photo.uid,
    });

  private listenPhotoComments = () =>
    this.commentsRef &&
    this.commentsRef.on('value', (snapshot: DataSnapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach(snap => {
        comments.push(Object.create({ ...snap.val(), uid: snap.key }));
      });
      this.setState({
        commentsCount: snapshot.numChildren(),
        displayComments: comments.slice(
          Math.max(comments.length - this.props.displayCommentsLength, 0),
        ),
      });
    });

  private onCommentClick = () => this.inputRef.focus();

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
    const { photo, dispatch } = this.props;
    const { likesCount, commentsCount, comment, displayComments } = this.state;

    return (
      <Card
        style={{ maxWidth: 614, margin: 'auto' }}
        className={styles.card}
        hoverable
        cover={
          photo.url ? (
            <img
              onClick={this.selectPhoto}
              style={{ objectFit: 'cover', maxHeight: 714 }}
              alt={photo.description}
              src={photo.url}
            />
          ) : (
            <Skeleton avatar={{ shape: 'square', size: 200 }}/>
          )
        }
      >
        <Card.Meta
          avatar={<FirebaseImage type="user" id={photo.author.uid}/>}
          description={<Typography.Text>{photo.description}</Typography.Text>}
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
            <span>{moment(photo.creationTime).fromNow()}</span>,
          ]}
        ></List.Item>
        {displayComments && displayComments.length > 0 && (
          <List<Comment>
            size="small"
            rowKey={item => item.uid}
            dataSource={displayComments}
            renderItem={item => (
              <CommentView
                comment={item}
                photo={photo}
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
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(PhotoView);
