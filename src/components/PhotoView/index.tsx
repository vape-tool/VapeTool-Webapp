import { Card, Icon, Input, List, message, Skeleton, Typography } from 'antd';
import React from 'react';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import FirebaseImage from '@/components/StorageAvatar';
import { Photo } from '@/types/photo';
import { Comment } from '@/types/comment';
import { database, DataSnapshot, Reference } from '@/utils/firebase';
import { Dispatch } from '@/models/connect';
import CommentView from '@/components/CommentView';
import moment from 'moment';

interface PhotoViewProps {
  photo: Photo;
  dispatch: Dispatch;
}

interface PhotoViewState {
  // src?: string;
  likesCount?: number;
  commentsCount?: number;
  comment: string;
  displayComments?: Comment[];
}

class PhotoView extends React.Component<PhotoViewProps, PhotoViewState> {
  state: PhotoViewState = {
    // src: undefined,
    likesCount: undefined,
    commentsCount: undefined,
    comment: '',
    displayComments: undefined,
  };

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
    this.setState({ comment: e.target.value })
  };

  postComment = () => {
    this.props.dispatch({
      type: 'photo/commentPhoto',
      payload: { comment: this.state.comment, photoId: this.props.photo.uid },
    });
    message.info('Post')
  };

  onReplyComment = (comment: Comment) => {
    this.setState({ comment: `@${comment.author.displayName.trim().replace(' ', '_')} ` })
  };

  render() {
    const IconText = ({ type, text, onClick }: { type: string, text: string, onClick: any }) => (
      <span>
        <Icon onClick={onClick} type={type} style={{ marginRight: 8 }}/>
        {text}
      </span>
    );
    const { photo, dispatch } = this.props;
    const { likesCount, commentsCount, comment, displayComments } = this.state;

    return (
      <Card
        style={{ maxWidth: 614 }}
        className={styles.card}
        hoverable
        cover={
          photo.url ? (
            <img style={{ objectFit: 'cover', maxHeight: 714 }} alt={photo.description} src={photo.url}/>
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
            <IconText onClick={this.onLikeClick} type="like-o" text={`${likesCount || 0}`} key="list-vertical-like-o"/>,
            <IconText onClick={this.onLikeClick} type="message" text={`${commentsCount || 0}`}
                      key="list-vertical-message"/>,
            <span>{moment(photo.creationTime).fromNow()}</span>,
          ]}>

        </List.Item>
        {displayComments && displayComments.length > 0 &&
        <List<Comment>
            size="small"
            rowKey={item => item.uid}
            dataSource={displayComments}
            renderItem={item => (
              <CommentView comment={item}
                           photo={photo}
                           dispatch={dispatch}
                           onReply={this.onReplyComment}/>)}
        />
        }
        <Input onPressEnter={this.postComment} value={comment} onChange={this.onChangeCommentText}
               placeholder="Add a comment..."
               suffix={<a onClick={this.postComment}>Post</a>}/>
      </Card>

    );
  }

  private listenPhotoLikes = () =>
    this.likesRef &&
    this.likesRef.on('value', (snapshot: DataSnapshot) => {
      this.setState({ likesCount: snapshot.numChildren() });
    });

  private listenPhotoComments = () =>
    this.commentsRef &&
    this.commentsRef.on('value', (snapshot: DataSnapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach(snap => {
        comments.push(Object.create({ ...snap.val(), uid: snap.key }))
      });
      this.setState({
        commentsCount: snapshot.numChildren(),
        displayComments: comments.slice(Math.max(comments.length - 3, 0)),
      });
    });

  private onLikeClick = () =>
    this.props.dispatch({
      type: 'photo/likePhoto',
      photoId: this.props.photo.uid,
    });
}

export default PhotoView;
