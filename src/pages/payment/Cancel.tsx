import React from 'react';
import { Button, Result } from 'antd';
import { redirectTo } from '@/models/global';
import { getPaymentUrl } from '@/places/user.places';

const CancelPayment: React.FC = () => {
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

export default CancelPayment;
