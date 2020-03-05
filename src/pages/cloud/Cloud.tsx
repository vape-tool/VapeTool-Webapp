import React, { useEffect } from 'react';
import { Affix, Button, List } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from '@/components/ItemView/styles.less';
import { PhotoView } from '@/components/ItemView';
import PhotoPreviewModal from '@/components/PreviewModal';
import PostView from '@/components/ItemView/PostView';
import { Link, Photo, Post } from '@/types';
import PageLoading from '@/components/PageLoading';
import LinkView from '@/components/ItemView/LinkView';
import { subscribeLinks, subscribePhotos, subscribePosts } from '@/services/items';
import { redirectBack } from '@/models/global';

interface AuthComponentProps extends ConnectProps {
  photos: Array<Photo>;
  posts: Array<Post>;
  links: Array<Link>;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const onUploadPhotoClicked = () => redirectBack(props.dispatch);

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
        style={{ maxWidth: 614, margin: '0 auto' }}
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
          return <div />;
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
