import { Card, Typography } from 'antd';
import React from 'react';
import { Link, useModel } from 'umi';
import { CurrentUser } from '@/app';
import { Post, ItemName } from '@/types';
import { ImageType } from '@/services/storage';
import { getUserProfileUrl } from '@/places/user.places';
import { Actions } from './ItemView';
import styles from './styles.less';
import FirebaseImage from '../StorageAvatar';


export default function PostView({
  item,
  displayCommentsLength,
  currentUser,
}: {
  item: Post;
  displayCommentsLength: number;
  currentUser: CurrentUser;
}) {
  const { setSelectedItem, unselectItem } = useModel('preview');
  const onSelectItem = () => setSelectedItem(item);

  return (
    <Card className={styles.card} hoverable>
      <Card.Meta
        avatar={
          <Link to={getUserProfileUrl(item.author.uid)}>
            <FirebaseImage type={ImageType.USER} id={item.author.uid} />
          </Link>
        }
        title={
          <span onClick={onSelectItem}>
            <Typography.Text>{item.title}</Typography.Text>
          </span>
        }
        description={
          <span onClick={onSelectItem}>
            <Typography.Text>{item.text}</Typography.Text>
          </span>
        }
      />
      <Actions
        what={ItemName.LINK}
        item={item}
        user={currentUser}
        displayCommentsLength={displayCommentsLength}
        unselectItem={unselectItem}
      />
    </Card>
  );
}
