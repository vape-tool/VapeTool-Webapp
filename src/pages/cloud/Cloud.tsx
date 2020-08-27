import React, { useEffect } from 'react';
import { Affix, Button, List } from 'antd';
import { useModel, history } from 'umi';
import styles from '@/components/ItemView/styles.less';
import { PhotoView } from '@/components/ItemView';
import PhotoPreviewModal from '@/components/PreviewModal';
import PostView from '@/components/ItemView/PostView';
import { Link, Photo, Post } from '@/types';
import PageLoading from '@/components/PageLoading';
import LinkView from '@/components/ItemView/LinkView';
import { subscribeLinks, subscribePhotos, subscribePosts } from '@/services/items';

import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';

const Cloud: React.FC = () => {
  const onUploadPhotoClicked = () => history.push('/cloud/upload');
  const { setLinks, setPhotos, setPosts, posts, links, photos } = useModel('cloud');

  const { initialState } = useModel('@@initialState');
  const { firebaseUser } = initialState || {};

  useEffect(() => subscribeLinks(setLinks), []);
  useEffect(() => subscribePhotos(setPhotos), []);
  useEffect(() => subscribePosts(setPosts), []);

  if (photos === undefined || posts === undefined || links === undefined) {
    return <PageLoading />;
  }
  const items = [...photos, ...posts, ...links].sort(
    (a, b) => Number(b.creationTime) - Number(a.creationTime),
  );
  return (
    <PageContainer>
      <List<Photo | Post | Link>
        className={styles.coverCardList}
        style={{ maxWidth: 614, margin: '0 auto' }}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={items}
        renderItem={(item) => {
          if (item.$type === 'photo') {
            return <PhotoView displayCommentsLength={3} item={item as Photo} />;
          }
          if (item.$type === 'post') {
            return <PostView displayCommentsLength={3} item={item as Post} />;
          }
          if (item.$type === 'link') {
            return <LinkView displayCommentsLength={3} item={item as Link} />;
          }
          return <div />;
        }}
      />
      <PhotoPreviewModal />
      {firebaseUser && !firebaseUser.isAnonymous && (
        <Affix offsetBottom={30}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            shape="circle"
            size="large"
            onClick={onUploadPhotoClicked}
          />
        </Affix>
      )}
    </PageContainer>
  );
};

export default Cloud;
