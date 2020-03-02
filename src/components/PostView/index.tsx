import { Card, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import FirebaseImage from '@/components/StorageAvatar';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import { ItemView } from '@/components/ItemView';
import { Post } from '@/types';
import { ItemName } from '@/types/Item';
import { ImageType } from '@/services/storage';

class PostView extends ItemView<Post> {
  what: ItemName = ItemName.POST;

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <Card style={{ maxWidth: 614, margin: 'auto' }} className={styles.card} hoverable>
        <Card.Meta
          avatar={
            <Link to={`/user/profile/${item.author.uid}`}>
              <FirebaseImage type={ImageType.USER} id={item.author.uid} />
            </Link>
          }
          title={
            <span onClick={this.onSelectItem}>
              <Typography.Text>{item.title}</Typography.Text>
            </span>
          }
          description={
            <span onClick={this.onSelectItem}>
              <Typography.Text>{item.text}</Typography.Text>
            </span>
          }
        />

        <this.Actions />
        {displayComments && displayComments.length > 0 && <this.CommentsList />}
        <this.CommentInput />
      </Card>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(PostView);
