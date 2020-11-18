import React from 'react';
import { Button, Result } from 'antd';
import { getPageQuery } from '@/utils/utils';
import { history } from 'umi';

const SuccessPayment: React.FC = () => {
  const goBack = () => history.replace('/user/profile');
  // TODO this is stripe way, handle also paypal, and maybe coinbase, not sure
  const params = getPageQuery();
  const sessionId = params.session_id;
  return (
    <Result
      status="success"
      title="Successfully Purchased Vape Tool Pro"
      subTitle={`Order number: ${sessionId}`}
      extra={[
        <Button type="primary" key="account" onClick={goBack}>
          Go to your account page
        </Button>,
      ]}
    />
  );
};

export default SuccessPayment;
