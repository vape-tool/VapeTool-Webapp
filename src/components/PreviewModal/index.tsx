import { Modal } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PhotoView from '@/components/ItemView/PhotoView';
import { Item } from '@/types';
import { dispatchSelectItem } from '@/models/preview';
import PostView from '../ItemView/PostView';
import LinkView from '../ItemView/LinkView';

interface PhotoPreviewModalProps extends ConnectProps {
  user?: CurrentUser;
  selectedItem?: Item;
}

const ItemPreviewModal: React.FC<PhotoPreviewModalProps> = (props: PhotoPreviewModalProps) => {
  const { dispatch, selectedItem } = props;
  console.log(`selected ${selectedItem}`);
  const onCancel = () => dispatchSelectItem(dispatch, undefined);
  if (!selectedItem) {
    return <div />;
  }
  let content;
  if (selectedItem.$type === 'photo') {
    content = <PhotoView item={selectedItem} displayCommentsLength={Number.MAX_SAFE_INTEGER} />;
  } else if (selectedItem.$type === 'post') {
    content = <PostView item={selectedItem} displayCommentsLength={Number.MAX_SAFE_INTEGER} />;
  } else {
    content = <LinkView item={selectedItem} displayCommentsLength={Number.MAX_SAFE_INTEGER} />;
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

export default connect(({ preview, user }: ConnectState) => ({
  user: user.currentUser,
  selectedItem: preview.selectedItem,
}))(ItemPreviewModal);
