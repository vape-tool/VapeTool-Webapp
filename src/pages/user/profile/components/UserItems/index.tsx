import { List } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '@/components/ItemView/styles.less';
import { Item } from '@/types';

interface UserItemProps<T extends Item> {
  userId: string;
  renderItem: (item: T) => any;
  subscribe: (onChange: (newItems: T[]) => void, userId: string) => () => void;
}

export default function UserItems<T extends Item>({
  userId,
  renderItem,
  subscribe,
}: UserItemProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    return subscribe(setItems, userId);
  }, []);

  return (
    <List<T>
      className={styles.coverCardList}
      style={{ marginBottom: 0 }}
      rowKey="uid"
      itemLayout="vertical"
      dataSource={items}
      renderItem={renderItem}
    />
  );
}
