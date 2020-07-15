import { Modal } from 'antd';
import * as React from 'react';
import PhotoView from '@/components/ItemView/PhotoView';
import { ItemName, Photo, Link, Post } from '@/types';
import { useModel } from 'umi';
import PostView from '../ItemView/PostView';
import LinkView from '../ItemView/LinkView';

const ItemPreviewModal: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { selectedItem, unselectItem } = useModel('preview');
  console.log(`selected ${selectedItem}`);
  const onCancel = () => unselectItem();
  if (!selectedItem || !currentUser) {
    return <div />;
  }
  let content;
  if (selectedItem.$type === ItemName.PHOTO) {
    content = (
      <PhotoView item={selectedItem as Photo} displayCommentsLength={Number.MAX_SAFE_INTEGER} />
    );
  } else if (selectedItem.$type === 'post') {
    content = (
      <PostView
        item={selectedItem as Post}
        currentUser={currentUser}
        displayCommentsLength={Number.MAX_SAFE_INTEGER}
      />
    );
  } else {
    content = (
      <LinkView
        item={selectedItem as Link}
        currentUser={currentUser}
        displayCommentsLength={Number.MAX_SAFE_INTEGER}
      />
    );
  }
  return (
    <Modal
      footer={null}
      centered
      bodyStyle={{ padding: 0 }}
      visible={selectedItem !== undefined}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  );
};

export default ItemPreviewModal;
