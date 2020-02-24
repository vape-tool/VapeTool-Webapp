import { Card, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
// @ts-ignore
import Microlink from '@microlink/react';
import FirebaseImage from '@/components/StorageAvatar';
import { ConnectState } from '@/models/connect';
import styles from '../ItemView/index.less';
import { ItemView } from '@/components/ItemView';
import { ItemName } from '@/types/Item';
import { Link } from '@/types';
import { ImageType } from '@/services/storage';

class LinkView extends ItemView<Link> {
  what: ItemName = ItemName.LINK;

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <Card style={{ maxWidth: 614, margin: 'auto' }} className={styles.card} hoverable>
        <Card.Meta
          avatar={<FirebaseImage type={ImageType.USER} id={item.author.uid} />}
          title={
            <span onClick={this.onSelectItem}>
              <Typography.Text>{item.title}</Typography.Text>
            </span>
          }
          description={
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Typography.Text>{item.url}</Typography.Text>
            </a>
          }
        />
        <br />
        <Microlink url={item.url} lazy />
        <this.Actions />

        {displayComments && displayComments.length > 0 && <this.CommentsList />}
        <this.CommentInput />
      </Card>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(LinkView);
