import { Col, Icon, Row, Tabs } from 'antd';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import UploadPost from '@/components/UploadPost';
import UploadPhoto from '@/pages/cloud/UploadPhoto';

interface UploadProps {
  currentTab: string;
  dispatch: Dispatch;
}

const Upload: React.FC<UploadProps> = props => {
  const { dispatch, currentTab } = props;
  const onTabChange = (tab: string) => {
    dispatch({
      type: 'upload/setTab',
      tab,
    });
  };

  return (
    <Row type="flex">
      <Col xs={0} md={4} lg={6} xl={8} />
      <Col xs={24} md={16} lg={14} xl={10}>
        <Tabs onChange={onTabChange} type="card" activeKey={currentTab}>
          <Tabs.TabPane
            tab={
              <span>
                <Icon type="picture" />
                Image
              </span>
            }
            key="photo"
          >
            <UploadPhoto />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <Icon type="form" />
                Post
              </span>
            }
            key="post"
          >
            <UploadPost type="post" />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <Icon type="link" />
                Link
              </span>
            }
            key="link"
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
