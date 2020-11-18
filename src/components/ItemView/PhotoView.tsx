import React from 'react';
import { Link, useModel } from 'umi';
import { Card, Skeleton, Typography } from 'antd';
import { Photo } from '@/types';
import FirebaseImage from '@/components/StorageAvatar';
import { ItemName } from '@/types/Item';
import { ImageType } from '@/services/storage';
import { getUserProfileUrl } from '@/places/user.places';
import styles from './styles.less';
import { Actions } from './ItemView';

export default function PhotoView({ item }: { item: Photo }) {
  const { setSelectedItem, unselectItem } = useModel('preview');
  const onSelectItem = () => setSelectedItem(item);

  return (
    <Card
      className={styles.card}
      cover={
        item.url ? (
          <img
            onClick={onSelectItem}
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
      <Actions what={ItemName.PHOTO} item={item} unselectItem={unselectItem} />
    </Card>
  );
}
