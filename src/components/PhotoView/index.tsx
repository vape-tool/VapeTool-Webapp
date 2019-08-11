import { Card, Icon, List, Skeleton, Typography } from 'antd';
import React from 'react';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import CommentIcon from '@/assets/CommentIcon';
import FirebaseImage from '@/components/StorageAvatar';
import { Photo } from '@/types/photo';
import { database, DataSnapshot, Reference } from '@/utils/firebase';
import { Dispatch } from '@/models/connect';

interface PhotoViewProps {
  photo: Photo;
  dispatch: Dispatch;
}

interface PhotoViewState {
  // src?: string;
  likesCount?: number;
  commentsCount?: number;
}

class PhotoView extends React.Component<PhotoViewProps, PhotoViewState> {
  state: PhotoViewState = {
    // src: undefined,
    likesCount: undefined,
    commentsCount: undefined,
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

  render() {
    const { photo } = this.props;
    const { likesCount, commentsCount } = this.state;
    return (
      <List.Item>
        <Card
          className={styles.card}
          hoverable
          cover={
            photo.url ? (
              <img alt={photo.description} src={photo.url}/>
            ) : (
              <Skeleton avatar={{ shape: 'square', size: 200 }}/>
            )
          }
          actions={[
            <Icon type="like" onClick={() => this.onLikeClick(photo.uid)}/>,
            <CommentIcon/>,
          ]}
        >
          <Card.Meta
            avatar={<FirebaseImage type="user" id={photo.author.uid}/>}
            description={<Typography.Text>{photo.description}</Typography.Text>}
          />
          <div className={styles.cardItemContent}>
            {likesCount && <span>{likesCount} likes</span>}
            <span>{commentsCount || 0} comments</span>
          </div>
        </Card>
      </List.Item>
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
      this.setState({ commentsCount: snapshot.numChildren() });
    });

  private onLikeClick = (id: string) =>
    this.props.dispatch({
      type: 'photo/likePhoto',
      payload: id,
    });
}

export default PhotoView;
