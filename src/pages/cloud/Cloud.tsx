import React, { useEffect } from 'react';
import { Affix, Button, List } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from '@/components/ItemView/index.less';
import PhotoView from '@/components/PhotoView';
import PhotoPreviewModal from '@/components/PreviewModal';
import PostView from '@/components/PostView';
import { Photo, Post, Link } from '@/types';
import PageLoading from '@/components/PageLoading';
import LinkView from '@/components/LinkView';
import { subscribeLinks, subscribePosts, subscribePhotos } from '@/services/items';

interface AuthComponentProps extends ConnectProps {
  photos: Array<Photo>;
  posts: Array<Post>;
  links: Array<Link>;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const onUploadPhotoClicked = () =>
    props.dispatch &&
    props.dispatch({
      type: 'global/redirectTo',
      path: '/cloud/upload',
    });

  useEffect(() => subscribeLinks(props.dispatch!), []);
  useEffect(() => subscribePosts(props.dispatch!), []);
  useEffect(() => subscribePhotos(props.dispatch!), []);

  const { photos, posts, links } = props;

  if (photos === undefined || posts === undefined || links === undefined) {
    return <PageLoading />;
  }
  const items = [...photos, ...posts, ...links].sort(
    (a, b) => Number(b.creationTime) - Number(a.creationTime),
  );
  return (
    <div>
      <List<Photo | Post | Link>
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item => {
          if (item.$type === 'photo') {
            return <PhotoView displayCommentsLength={3} item={item} />;
          }
          if (item.$type === 'post') {
            return <PostView displayCommentsLength={3} item={item} />;
          }
          if (item.$type === 'link') {
            return <LinkView displayCommentsLength={3} item={item} />;
          }
          return <div></div>;
        }}
      />
      <PhotoPreviewModal />
      <Affix offsetBottom={30}>
        <Button
          type="primary"
          icon="plus"
          shape="circle"
          size="large"
          onClick={onUploadPhotoClicked}
        />
      </Affix>
    </div>
  );
};

export default connect(({ cloud }: ConnectState) => ({
  photos: cloud.photos,
  posts: cloud.posts,
  links: cloud.links,
}))(Cloud);
