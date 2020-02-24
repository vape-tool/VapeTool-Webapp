import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
// @ts-ignore
import Image from 'react-image-webp';
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

const guideImage = require('@/assets/ohm_law.webp');

export interface OhmLawProps extends FormComponentProps {
  ohm: OhmModelState;
  dispatch: Dispatch;
}

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
        <Row type="flex" justify="center" gutter={32}>
          <Col xs={20} sm={18} md={12}>
            <Form {...formItemLayout} onSubmit={handleCalculate}>
              <Form.Item label="Voltage">
                <InputNumber
                  value={voltage}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onVoltageChange}
                  placeholder="Volts [V]"
                />
                {lastEdits.includes('voltage') && <Icon type="lock" />}
              </Form.Item>
              <Form.Item label="Resistance">
                <InputNumber
                  value={resistance}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onResistanceChange}
                  placeholder="Ohms [Ω]"
                />
                {lastEdits.includes('resistance') && <Icon type="lock" />}
              </Form.Item>
              <Form.Item label="Current">
                <InputNumber
                  value={current}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onCurrentChange}
                  placeholder="Amps [A]"
                />
                {lastEdits.includes('current') && <Icon type="lock" />}
              </Form.Item>
              <Form.Item label="Power">
                <InputNumber
                  value={power}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onPowerChange}
                  placeholder="Wats [W]"
                />
                {lastEdits.includes('power') && <Icon type="lock" />}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <ButtonGroup>
                  <Button type="primary" htmlType="submit">
                    Calculate
                  </Button>
                  <Button type="default" onClick={handleClear}>
                    Clear
                  </Button>
                </ButtonGroup>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={18} sm={16} md={10} lg={8}>
            <Image webp={guideImage} style={{ width: '100%' }} />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

const OhmLawForm = Form.create<OhmLawProps>({ name: 'ohm_law' })(OhmLaw);

export default connect(({ ohm }: ConnectState) => ({
  ohm,
}))(OhmLawForm);
