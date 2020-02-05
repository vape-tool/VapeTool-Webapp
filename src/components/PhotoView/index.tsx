import React from 'react';
import { connect } from 'dva';
import { Photo } from '@/types';
import { ConnectState } from '@/models/connect';
import { Card, Skeleton, Typography } from 'antd';
import FirebaseImage from '@/components/StorageAvatar';
import { ItemView } from '../ItemView';
import styles from '../ItemView/index.less';
import { ItemName } from '@/types/Item';

class PhotoView extends ItemView<Photo> {
  what: ItemName = 'gear';

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <Card
        style={{ maxWidth: 614, margin: 'auto' }}
        className={styles.card}
        hoverable
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
          avatar={<FirebaseImage type="user" id={item.author.uid} />}
          description={<Typography.Text>{item.description}</Typography.Text>}
        />
        <this.Actions />

        <br/>
        {displayComments && displayComments.length > 0 && <this.CommentsList />}
        <this.CommentInput />
      </Card>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(PhotoView);
