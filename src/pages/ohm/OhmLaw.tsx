import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { LockOutlined } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import {
  clear,
  OhmModelState,
  onChange,
  SET_CURRENT,
  SET_POWER,
  SET_RESISTANCE,
  SET_VOLTAGE,
  calculate,
} from '@/models/ohm';
import ImageWebp from '@/components/ImageWebp';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

const ohmLawWebp = require('@/assets/ohm_law.webp');
const ohmLawPng = require('@/assets/ohm_law.png');

export interface OhmLawProps {
  ohm: OhmModelState;
  dispatch: Dispatch;
}

// TODO check if not needed adjust to new Form API
const OhmLaw: React.FC<OhmLawProps> = props => {
  const { dispatch, ohm } = props;
  const { voltage, resistance, current, power, lastEdit, latestEdit } = ohm;
  const lastEdits = [lastEdit, latestEdit];

  const onVoltageChange = onChange(dispatch, SET_VOLTAGE);
  const onResistanceChange = onChange(dispatch, SET_RESISTANCE);
  const onCurrentChange = onChange(dispatch, SET_CURRENT);
  const onPowerChange = onChange(dispatch, SET_POWER);

  const handleClear = () => clear(dispatch);

  const handleCalculate = (e: any) => {
    e.preventDefault();
    calculate(dispatch);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <Row justify="center" gutter={32}>
          <Col xs={24} sm={20} md={14}>
            <Form {...formItemLayout} onSubmitCapture={handleCalculate}>
              <Form.Item
                label={<FormattedMessage id="misc.properties.voltage" defaultMessage="Voltage" />}
              >
                <InputNumber
                  value={voltage}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onVoltageChange}
                  placeholder={formatMessage({
                    id: 'misc.units.long.volt',
                    defaultMessage: 'Volts [V]',
                  })}
                />
                {lastEdits.includes('voltage') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage id="misc.properties.resistance" defaultMessage="Resistance" />
                }
              >
                <InputNumber
                  value={resistance}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onResistanceChange}
                  placeholder={formatMessage({
                    id: 'misc.units.long.ohm',
                    defaultMessage: 'Ohms [Ω]',
                  })}
                />
                {lastEdits.includes('resistance') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={<FormattedMessage id="misc.properties.current" defaultMessage="Current" />}
              >
                <InputNumber
                  value={current}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onCurrentChange}
                  placeholder={formatMessage({
                    id: 'misc.units.long.amp',
                    defaultMessage: 'Amps [A]',
                  })}
                />
                {lastEdits.includes('current') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={<FormattedMessage id="misc.properties.power" defaultMessage="Power" />}
              >
                <InputNumber
                  value={power}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onPowerChange}
                  placeholder={formatMessage({
                    id: 'misc.units.long.wat',
                    defaultMessage: 'Wats [W]',
                  })}
                />
                {lastEdits.includes('power') && <LockOutlined />}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <ButtonGroup>
                  <Button type="primary" htmlType="submit">
                    <FormattedMessage id="misc.actions.calculate" defaultMessage="Calculate" />
                  </Button>

                  <Button type="default" onClick={handleClear}>
                    <FormattedMessage id="misc.actions.clear" defaultMessage="Reset" />
                  </Button>
                </ButtonGroup>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={18} sm={14} md={8} lg={8}>
            <ImageWebp
              webp={ohmLawWebp}
              png={ohmLawPng}
              style={{ width: '100%' }}
              alt="Ohm Law formulas"
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ ohm }: ConnectState) => ({
  ohm,
}))(OhmLaw);
