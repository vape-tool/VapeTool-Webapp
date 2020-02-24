import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Skeleton, Typography } from 'antd';
import FirebaseImage from '@/components/StorageAvatar';
import { ItemView, ItemViewProps, ItemViewState } from '../ItemView';
import styles from './index.less';
import { ItemName } from '@/types/Item';
import { Coil } from '@/types';
import { getCoilUrl, ImageType } from '@/services/storage';

interface CoilViewState extends ItemViewState {
  coilImageUrl: string;
}

class CoilView extends ItemView<Coil, ItemViewProps<Coil>, CoilViewState> {
  what: ItemName = ItemName.COIL;

  componentDidMount(): void {
    super.componentDidMount();
    this.fetchCoilImage();
  }

  fetchCoilImage = async () => {
    const coilImageUrl = await getCoilUrl(this.props.item.uid);
    if (coilImageUrl) {
      this.setState({ coilImageUrl });
    }
  };

  render() {
    const { item } = this.props;
    const { displayComments, coilImageUrl } = this.state;

    return (
      <Card
        style={{ maxWidth: 614, margin: 'auto' }}
        className={styles.card}
        hoverable
        cover={
          coilImageUrl ? (
            <img
              onClick={this.onSelectItem}
              style={{ objectFit: 'cover', maxHeight: 714 }}
              alt={item.description}
              src={coilImageUrl}
            />
          ) : (
            <Skeleton avatar={{ shape: 'square', size: 200 }} />
          )
        }
      >
        <Card.Meta
          avatar={<FirebaseImage type={ImageType.USER} id={item.author.uid} />}
          description={<Typography.Text>{item.description}</Typography.Text>}
        />
        <this.Actions />

        {displayComments && displayComments.length > 0 && <this.CommentsList />}
        <this.CommentInput />
      </Card>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(CoilView);
