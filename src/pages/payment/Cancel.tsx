import React from 'react';
import { Button, Result } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';

const CancelPayment: React.FC<ConnectProps> = (props: ConnectProps) => {
  const onBuyAgainClick = () =>
    props.dispatch &&
    props.dispatch(
      routerRedux.replace({
        pathname: '/payment',
        search: stringify({
          redirect: window.location.href,
        }),
      }),
    );

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
