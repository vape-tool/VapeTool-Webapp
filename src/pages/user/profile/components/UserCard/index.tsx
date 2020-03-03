import { CurrentUser } from '@/models/user';
import { UserProfile } from '@/models/userProfile';
import React from 'react';
import FirebaseImage from '@/components/StorageAvatar';
import { ImageType } from '@/services/storage';
import { Avatar, Button, Card, Col, Divider, Icon, Row } from 'antd';
import { Link } from 'umi';
import UserTags from '@/pages/user/profile/components/UserCard/UserTags';
import styles from './styles.less';
import { getCancelSubscriptionUrl, getCurrentUserEditProfileUrl } from '@/places/user.places';

interface UserCardProps {
  isCurrentUser: boolean;
  currentUser: CurrentUser;
  userProfile: UserProfile;
  isLoading: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  userProfile: profile,
  isLoading,
  isCurrentUser,
  currentUser,
}) => {
  const userTags = profile?.tags || [];

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
        <FirebaseImage type={ImageType.USER} id={profile.uid} size={150} />
      </div>

      <div className={styles.content}>
        <Row>
          <Col xs={24} lg={isCurrentUser ? 16 : 24}>
            <h4 className={styles.name}>{profile.name}</h4>
            {isCurrentUser && (
              <div className={styles.detail}>
                <p>
                  <i className={styles.title} />
                  {currentUser.title}
                </p>
                <p>
                  <i className={styles.group} />
                  {currentUser.group}
                </p>
              </div>
            )}

            <Divider className={styles.divider} dashed />

            <UserTags userTags={userTags} />

            <Divider className={styles.divider} dashed />

            <div className={styles.infos}>
              <div className={styles.infoGroup}>
                <span className={styles.value}>451</span>
                <span className={styles.label}>photos</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.value}>123</span>
                <span className={styles.label}>coils</span>
              </div>
            </div>
          </Col>
          {isCurrentUser && (
            <Col xs={24} lg={8} className={styles.buttons}>
              <Link to={getCurrentUserEditProfileUrl()}>
                <Button type="default" shape="round" size="small" block>
                  <Icon type="edit" />
                  Edit profile
                </Button>
              </Link>

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

export default UserCard;
