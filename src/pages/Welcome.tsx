import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';

const { Paragraph, Text } = Typography;

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card title={<Typography.Title>🚧 Vape Tool Webapp - Alpha 🚧</Typography.Title>}>
      <Typography>

        <Paragraph>
          This webapp is currently under heavy development 🏗 . You might find a lot of bugs or even dragons 🐉...
        <Text strong>
            Please use this app on your own risk 👷.
      </Text>
        </Paragraph>
      </Typography>
    </Card>
  </PageHeaderWrapper>
);
