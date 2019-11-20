import React from 'react';
import { Affix, Button, List } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from '@/pages/user/center/components/UserPhotos/index.less';
import PhotoView from '@/components/PhotoView';
import PhotoPreviewModal from '@/components/PreviewModal';
import PostView from '@/components/PostView';
import { Photo } from '@/types/photo';
import PageLoading from '@/components/PageLoading';
import LinkView from '@/components/LinkView';
import { Post } from '@/types/Post';
import { Link } from '@/types/Link';

interface AuthComponentProps extends ConnectProps {
  photos: Array<Photo>;
  posts: Array<Post>;
  links: Array<Link>;
  dispatch: Dispatch;
}

const Cloud: React.FC<AuthComponentProps> = props => {
  const onUploadPhotoClicked = () =>
    props.dispatch &&
    props.dispatch({
      type: 'global/redirectTo',
      path: '/cloud/upload',
    });

  const { photos, posts, links } = props;

  if (photos === undefined || posts === undefined || links === undefined) {
    return <PageLoading/>
  }
  let items = [...photos, ...posts, ...links];
  items = items.sort((a, b) => Number(b.creationTime) - Number(a.creationTime));
  return (
    <div>
      <List<Photo | Post | Link>
        className={styles.coverCardList}
        rowKey="uid"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item => {
          if (item.$type === 'photo') {
            return <PhotoView displayCommentsLength={3} photo={item}/>
          }
          if (item.$type === 'post') {
            return <PostView displayCommentsLength={3} post={item}/>
          }
          if (item.$type === 'link') {
            return <LinkView displayCommentsLength={3} link={item}/>
          }
          return <div></div>
        }}
      />
      <PhotoPreviewModal/>
      <Affix offsetBottom={30} offset={60}>
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
