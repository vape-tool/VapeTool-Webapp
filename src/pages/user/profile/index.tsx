import { Col, Icon, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import UserPhotos from './components/UserItems/UserPhotos';
import { ConnectState } from '@/models/connect';
import { CurrentUser, FETCH_CURRENT, USER } from '@/models/user';
import UserPosts from './components/UserItems/UserPosts';
import UserLinks from './components/UserItems/UserLinks';
import UserLiquids from './components/UserItems/UserLiquids';
import UserCoils from './components/UserItems/UserCoils';
import { CloudContent, dispatchFetchUserProfile, FETCH_USER_PROFILE, USER_PROFILE, UserProfile } from '@/models/userProfile';
import UserCard from '@/pages/user/profile/components/UserCard';
import styles from './styles.less';

interface UserProfileProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
  userProfile: UserProfile;
  profileLoading: boolean;
}

const Profile: React.FC<UserProfileProps> = props => {
  const { dispatch, currentUser, userProfile: profile, profileLoading, match } = props;
  const [tabKey, setTabKey] = useState(CloudContent.PHOTOS);
  let userId = match?.params['id'];
  const isCurrentUser = userId === undefined;
  const isLoading = profileLoading !== false || !profile;

  if (isCurrentUser) {
    userId = currentUser?.uid;
  }

  useEffect(() => {
    dispatchFetchUserProfile(dispatch, userId);
  }, [userId]);

  const renderContentByTabKey = () => {
    if (isLoading) {
      return <div />
    }

    switch (tabKey) {
      case CloudContent.PHOTOS:
        return <UserPhotos />;
      case CloudContent.POSTS:
        return <UserPosts />;
      case CloudContent.LINKS:
        return <UserLinks />;
      case CloudContent.COILS:
        return <UserCoils />;
      case CloudContent.LIQUIDS:
        return <UserLiquids />;
      default:
        throw new Error(`Unknown CloudContent tab: ${tabKey}`);
    }
  };

  const activeClass = (type: CloudContent): string => (tabKey === type ? styles.active : '');

  return (
    <GridContent>
      <Row type="flex" justify="space-around">
        <Col xs={24} md={24} xl={20} xxl={11}>
          <UserCard
            isCurrentUser={isCurrentUser}
            currentUser={currentUser}
            userProfile={profile}
            isLoading={isLoading}
          />
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} md={24} xl={20} xxl={11}>
          <div className={styles.itemsAndControl}>
            <div className={styles.controlContainer}>
              <div className={styles.controlPanel}>
                <ul>
                  <li
                    onClick={() => setTabKey(CloudContent.PHOTOS)}
                    className={`${activeClass(CloudContent.PHOTOS)}`}
                  >
                    <Icon type="camera" className={styles.icon} />
                    <span className={styles.label}>Photos</span>
                  </li>
                  <li
                    onClick={() => setTabKey(CloudContent.POSTS)}
                    className={`${activeClass(CloudContent.POSTS)}`}
                  >
                    <Icon type="message" className={styles.icon} />
                    <span className={styles.label}>Posts</span>
                  </li>
                  <li
                    onClick={() => setTabKey(CloudContent.LINKS)}
                    className={`${activeClass(CloudContent.LINKS)}`}
                  >
                    <Icon type="link" className={styles.icon} />
                    <span className={styles.label}>Links</span>
                  </li>
                  <li
                    onClick={() => setTabKey(CloudContent.COILS)}
                    className={`${activeClass(CloudContent.COILS)}`}
                  >
                    <i className={styles.icon}>
                      <img
                        src="https://web.vapetool.app/img/menu_icons/menu_coil_calculator.svg"
                        alt="coils"
                      />
                    </i>
                    <span className={styles.label}>Coils</span>
                  </li>
                  <li
                    onClick={() => setTabKey(CloudContent.LIQUIDS)}
                    className={`${activeClass(CloudContent.LIQUIDS)}`}
                  >
                    <i className={styles.icon}>
                      <img
                        src="https://web.vapetool.app/img/menu_icons/menu_liquid_blender.svg"
                        alt="coils"
                      />
                    </i>
                    <span className={styles.label}>Liquids</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.itemsPanel}>{renderContentByTabKey()}</div>
          </div>
        </Col>
      </Row>
    </GridContent>
  );
};

export default connect(({ loading, user, userProfile }: ConnectState) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects[`${USER}/${FETCH_CURRENT}`],
  userProfile: userProfile.userProfile,
  profileLoading: loading.effects[`${USER_PROFILE}/${FETCH_USER_PROFILE}`],
  firebaseUser: user.firebaseUser,
}))(Profile);
