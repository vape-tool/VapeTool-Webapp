import React from 'react';
import { Button, Result } from 'antd';
import { getPaymentUrl } from '@/places/user.places';
import { history } from 'umi';

const CancelPayment: React.FC = () => {
  const onBuyAgainClick = () => history.replace(getPaymentUrl());

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
