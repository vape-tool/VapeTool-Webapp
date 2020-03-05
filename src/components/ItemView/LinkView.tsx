import { Card, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
// @ts-ignore
import Microlink from '@microlink/react';
import FirebaseImage from '@/components/StorageAvatar';
import { ConnectState } from '@/models/connect';
import { ItemView } from './ItemView';
import { ItemName } from '@/types/Item';
import { Link as LinkType } from '@/types';
import { ImageType } from '@/services/storage';
import { getUserProfileUrl } from '@/places/user.places';
import styles from './styles.less';

class LinkView extends ItemView<LinkType> {
  what: ItemName = ItemName.LINK;

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <Card className={styles.card} hoverable>
        <Card.Meta
          avatar={
            <Link to={getUserProfileUrl(item.author.uid)}>
              <FirebaseImage type={ImageType.USER} id={item.author.uid} />
            </Link>
          }
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
