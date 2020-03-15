import { CurrentUser } from '@/models/user';
import { UserProfile } from '@/models/userProfile';
import React, { useEffect, useState } from 'react';
import FirebaseImage from '@/components/StorageAvatar';
import { ImageType } from '@/services/storage';
import { Avatar, Button, Card, Col, Divider, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UserTags from '@/pages/user/profile/components/UserCard/UserTags';
import { getCancelSubscriptionUrl, getCurrentUserEditProfileUrl } from '@/places/user.places';
import styles from './styles.less';
import { getUserTotalContentCount, getUserTotalLikesCount } from '@/services/userCenter';
import { redirectToWithFootprint } from '@/models/global';
import { ConnectProps } from '@/models/connect';
import { connect } from 'dva';

interface UserCardProps extends ConnectProps {
  isCurrentUser: boolean;
  currentUser?: CurrentUser;
  userProfile?: UserProfile;
  isLoading: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  userProfile: profile,
  isLoading,
  isCurrentUser,
  currentUser,
  dispatch,
}) => {
  const [userContentCount, setUserContentCount] = useState<number | undefined>(undefined);
  const [userLikesCount, setUserLikesCount] = useState<number | undefined>(undefined);
  const userTags = profile?.tags || [];
  useEffect(() => {
    if (profile) {
      getUserTotalContentCount(profile.uid).then(setUserContentCount);
      getUserTotalLikesCount(profile.uid).then(setUserLikesCount);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <Card bordered={false} className={styles.card} loading>
        <div className={styles.avatarHolder}>
          <Avatar size={150} />
        </div>
      </Card>
    );
  }

  return (
    <Card bordered={false} className={styles.card}>
      <div className={styles.avatarHolder}>
        <FirebaseImage type={ImageType.USER} id={profile ? profile.uid : ''} size={150} />
      </div>

      <div className={styles.content}>
        <Row>
          <Col xs={24} lg={isCurrentUser ? 16 : 24}>
            <h4 className={styles.name}>{profile ? profile.name : ''}</h4>
            {isCurrentUser && (
              <div className={styles.detail}>
                <p>
                  <i className={styles.title} />
                  {currentUser ? currentUser.title : ''}
                </p>
                <p>
                  <i className={styles.group} />
                  {currentUser ? currentUser.group : ''}
                </p>
              </div>
            )}

            <Divider className={styles.divider} dashed />

            <UserTags userTags={userTags} />

            <Divider className={styles.divider} dashed />

            <div className={styles.infos}>
              <div className={styles.infoGroup}>
                <span className={styles.value}>{userContentCount || ''}</span>
                <span className={styles.label}>posts</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.value}>{userLikesCount || ''}</span>
                <span className={styles.label}>likes</span>
              </div>
            </div>
          </Col>
          {isCurrentUser && (
            <Col xs={24} lg={8} className={styles.buttons}>
              <Button
                type="default"
                shape="round"
                size="small"
                block
                onClick={() => redirectToWithFootprint(dispatch, getCurrentUserEditProfileUrl())}
              >
                <EditOutlined />
                Edit profile
              </Button>

              <Button
                type="default"
                shape="round"
                size="small"
                block
                target="_blank"
                href={getCancelSubscriptionUrl()}
              >
                Cancel subscription
              </Button>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

export default connect()(UserCard);
