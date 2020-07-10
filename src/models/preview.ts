import { useState } from 'react';
import { Item } from '@/types';

export default () => {
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

  const unselectItem = () => {
    setSelectedItem(undefined);
  };

  return {
    selectedItem,
    setSelectedItem,
    unselectItem,
  };
};
