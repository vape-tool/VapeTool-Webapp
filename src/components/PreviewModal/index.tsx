import { Modal } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { Photo } from '@/types/photo';
import { Link } from '@/types/Link';
import { Post } from '@/types/Post';
import PhotoView from '@/components/PhotoView';
import PostView from '../PostView';
import LinkView from '../LinkView';

interface PhotoPreviewModalProps {
  dispatch: Dispatch;
  user?: CurrentUser;
  selectedItem?: Photo | Post | Link;
}

const ItemPreviewModal: React.FC<PhotoPreviewModalProps> = (props: PhotoPreviewModalProps) => {
  const { dispatch, selectedItem } = props;
  console.log(`selected ${selectedItem}`);
  const onCancel = () => {
    dispatch({
      type: 'cloud/selectItem',
      item: undefined,
    });
  };
  if (!selectedItem) {
    return <div></div>;
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
