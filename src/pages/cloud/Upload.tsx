import { Col, Row, Tabs } from 'antd';
import React from 'react';
import { connect, Dispatch, FormattedMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import UploadPost from '@/components/UploadPost';
import UploadPhoto from '@/pages/cloud/UploadPhoto';
import { Tab, changeTab } from '@/models/upload';
import { PictureOutlined, LinkOutlined, FormOutlined } from '@ant-design/icons';

interface UploadProps {
  currentTab: string;
  dispatch: Dispatch;
}

const Upload: React.FC<UploadProps> = props => {
  const { dispatch, currentTab } = props;
  const onTabChange = changeTab(dispatch);

  return (
    <Row>
      <Col xs={0} md={4} lg={6} xl={8} />
      <Col xs={24} md={16} lg={14} xl={10}>
        <Tabs onChange={onTabChange} type="card" activeKey={currentTab}>
          <Tabs.TabPane
            tab={
              <span>
                <PictureOutlined />
                <FormattedMessage id="user.photo" defaultMessage="Photo" />
              </span>
            }
            key={Tab.PHOTO}
          >
            <UploadPhoto />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <FormOutlined />
                <FormattedMessage id="user.post" defaultMessage="Post" />
              </span>
            }
            key={Tab.POST}
          >
            <UploadPost type="post" />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <LinkOutlined />
                <FormattedMessage id="user.link" defaultMessage="Link" />
              </span>
            }
            key={Tab.LINK}
          >
            <UploadPost type="link" />
          </Tabs.TabPane>
        </Tabs>
      </Col>
      <Col xs={0} md={4} lg={6} xl={8} />
    </Row>
  );
};

export default connect(({ upload }: ConnectState) => ({ currentTab: upload.currentTab }))(Upload);
