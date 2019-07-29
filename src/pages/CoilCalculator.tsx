import React from 'react';
import { Button, Card, Dropdown, Icon, Menu } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ClickParam } from 'antd/lib/menu';
import { connect } from 'dva';
import { CoilModelState, ConnectProps, ConnectState, Dispatch } from '@/models/connect';

const setupText = {
  1: 'Single Coil (1)',
  2: 'Double Coil (2)',
  3: 'Triple Coil (3)',
};

export interface CoilCalculatorProps extends ConnectProps {
  coil: CoilModelState,
  dispatch: Dispatch;
}

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil } = props;

  const handleMenuClick = (e: ClickParam): void =>
    dispatch && dispatch({
      type: 'coil/setSetup',
      payload: Number(e.key),
    });

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        Single Coil (1)
      </Menu.Item>
      <Menu.Item key="2">
        Dual Coil (2)
      </Menu.Item>
      <Menu.Item key="3">
        Triple Coil (3)
      </Menu.Item>
    </Menu>
  );

  function setupNumberToText(setup: number): string {
    return setupText[setup]
  }

  return (<PageHeaderWrapper>
      <Card>
        <Dropdown overlay={menu}>
          <Button>
            {setupNumberToText(coil.currentCoil.setup)} <Icon type="down"/>
          </Button>
        </Dropdown>
      </Card>
    </PageHeaderWrapper>
  )
};

export default connect(({ coil }: ConnectState) => ({
  coil,
}))(CoilCalculator);
