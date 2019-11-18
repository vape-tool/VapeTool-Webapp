import { Tabs } from 'antd';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

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
    <Tabs onChange={onTabChange} type="card" activeKey={currentTab}>
      <Tabs.TabPane tab="Post" key="post">
        <UploadPost />
        Content of Tab Pane 1
      </Tabs.TabPane>
      <Tabs.TabPane tab="Photo" key="photo">
        Content of Tab Pane 2
      </Tabs.TabPane>
      <Tabs.TabPane tab="Url" key="url">
        Content of Tab Pane 3
      </Tabs.TabPane>
    </Tabs>
  );
};

export default connect(({ upload }: ConnectState) => ({ currentTab: upload.currentTab }))(Upload);
