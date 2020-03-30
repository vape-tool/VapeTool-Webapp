import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';
import { redirectTo } from '@/models/global';
import { getPaymentUrl } from '@/places/user.places';

const CancelPayment: React.FC<ConnectProps> = () => {
  const onBuyAgainClick = () => redirectTo(getPaymentUrl());

  return (
    <Result
      status="info"
      title="Your operation has been cancelled"
      extra={[
        <Button type="primary" onClick={onBuyAgainClick}>
          Go back to payment page
        </Button>,
      ]}
    />
  );
};

export default connect()(CancelPayment);
