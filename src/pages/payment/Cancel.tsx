import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';
import { redirectToWithFootprint } from '@/models/global';

const CancelPayment: React.FC<ConnectProps> = (props: ConnectProps) => {
  const onBuyAgainClick = () => redirectToWithFootprint(props.dispatch!, '/payment');

  return (
    <Result
      status="info"
      title="Your operation has been cancelled"
      extra={[
        <Button type="primary" onClick={onBuyAgainClick}>
          Buy Again
        </Button>,
      ]}
    />
  );
};

export default connect()(CancelPayment);
