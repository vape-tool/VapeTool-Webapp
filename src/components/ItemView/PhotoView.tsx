import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Card, Skeleton, Typography } from 'antd';
import { Photo } from '@/types';
import { ConnectState } from '@/models/connect';
import FirebaseImage from '@/components/StorageAvatar';
import { ItemName } from '@/types/Item';
import { ImageType } from '@/services/storage';
import { getUserProfileUrl } from '@/places/user.places';
import { ItemView } from './ItemView';
import styles from './styles.less';

class PhotoView extends ItemView<Photo> {
  what: ItemName = ItemName.PHOTO;

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <Card
        className={styles.card}
        cover={
          item.url ? (
            <img
              onClick={this.onSelectItem}
              style={{ objectFit: 'cover', maxHeight: 714 }}
              alt={item.description}
              src={item.url}
            />
          ) : (
            <Skeleton avatar={{ shape: 'square', size: 200 }} />
          )
        }
      >
        <Card.Meta
          avatar={
            <Link to={getUserProfileUrl(item.author.uid)}>
              <FirebaseImage type={ImageType.USER} id={item.author.uid} />
            </Link>
          }
          description={<Typography.Text>{item.description}</Typography.Text>}
        />
        <this.Actions />

        <br />
        {displayComments && displayComments.length > 0 && <this.CommentsList />}
        <this.CommentInput />
      </Card>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(PhotoView);
