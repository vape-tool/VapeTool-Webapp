import React from 'react';
import { Typography } from 'antd';
import { useModel, useHistory } from 'umi';
import { getUserProfileUrl } from '@/places/user.places';
import { PageLoading } from '@ant-design/pro-layout';

const Profile: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const router = useHistory();
  if (!initialState) {
    return <Typography.Paragraph>Inital state have not been loaded</Typography.Paragraph>;
  }
  const { currentUser } = initialState;
  if (!initialState || !currentUser) {
    return <Typography.Paragraph>You must be logged in to preview this page</Typography.Paragraph>;
  }
  const userProfileUrl = getUserProfileUrl(currentUser.uid);
  router.replace(userProfileUrl);
  return <PageLoading />;
};

export default Profile;
