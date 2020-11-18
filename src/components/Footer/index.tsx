import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Typography } from 'antd';

export default () => (
  <DefaultFooter
    copyright={new Date(Date.now()).getFullYear().toString()}
    links={[
      {
        key: 'github',
        title: (
          <Typography.Text type="secondary">
            Check our Github <GithubOutlined />
          </Typography.Text>
        ),
        href: 'https://github.com/vape-tool/VapeTool-Webapp',
        blankTarget: true,
      },
    ]}
  />
);
