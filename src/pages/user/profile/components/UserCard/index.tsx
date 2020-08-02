import { CurrentUser } from '@/app';
import { UserProfile } from '@/models/profile';
import React, { useEffect, useState } from 'react';
import FirebaseImage from '@/components/StorageAvatar';
import { ImageType } from '@/services/storage';
import { Avatar, Button, Card, Col, Divider, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UserTags from '@/pages/user/profile/components/UserCard/UserTags';
import {
  getCancelSubscriptionUrl,
  getCurrentUserEditProfileUrl,
  getPaymentUrl,
} from '@/places/user.places';
import { getUserTotalContentCount, getUserTotalLikesCount } from '@/services/userCenter';
import { redirectTo } from '@/models/global';
import { FormattedMessage } from 'umi';
import { isProUser } from '@/utils/utils';
import styles from './styles.less';

interface UserCardProps {
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
                <span className={styles.value}>
                  {userContentCount !== undefined ? userContentCount : ''}
                </span>
                <span className={styles.label}>
                  <FormattedMessage id="user.posts" defaultMessage="Posts" />
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.value}>
                  {userLikesCount !== undefined ? userLikesCount : ''}
                </span>
                <span className={styles.label}>
                  <FormattedMessage id="user.likes" defaultMessage="Likes" />
                </span>
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
                onClick={() => redirectTo(getCurrentUserEditProfileUrl())}
              >
                <EditOutlined />
                <FormattedMessage id="user.actions.editProfile" defaultMessage="Edit profile" />
              </Button>

              {isProUser(currentUser?.subscription) && (
                <Button
                  type="default"
                  shape="round"
                  size="small"
                  block
                  target="_blank"
                  href={getCancelSubscriptionUrl()}
                >
                  <FormattedMessage
                    id="user.actions.cancelSubscription"
                    defaultMessage="Cancel subscription"
                  />
                </Button>
              )}
              {!isProUser(currentUser?.subscription) && (
                <Button
                  type="default"
                  shape="round"
                  size="small"
                  block
                  onClick={() => redirectTo(getPaymentUrl())}
                >
                  Unlock Pro
                </Button>
              )}
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

export default UserCard;
