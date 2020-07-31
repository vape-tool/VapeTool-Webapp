import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { useIntl, FormattedMessage, useModel } from 'umi';
import { LockOutlined } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';
import ImageWebp from '@/components/ImageWebp';

const ohmLawWebp = require('@/assets/ohm_law.webp');
const ohmLawPng = require('@/assets/ohm_law.png');

// TODO check if not needed adjust to new Form API
const OhmLaw: React.FC = () => {
  const {
    onVoltageChange,
    onResistanceChange,
    onCurrentChange,
    onPowerChange,
    clear,
    calculate,
    lastEdit,
    latestEdit,
    voltage,
    current,
    power,
    resistance,
  } = useModel('ohm');
  const lastEdits = [lastEdit, latestEdit];

  const handleClear = () => clear();

  const handleCalculate = (e: any) => {
    e.preventDefault();
    calculate();
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
                label={
                  <FormattedMessage id="misc.properties.voltage" defaultMessage="Voltage [V]" />
                }
              >
                <InputNumber
                  value={voltage}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onVoltageChange}
                  placeholder={useIntl().formatMessage({
                    id: 'misc.units.long.volt',
                    defaultMessage: 'Volts [V]',
                  })}
                />
                {lastEdits.includes('voltage') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage
                    id="misc.properties.resistance"
                    defaultMessage="Resistance [Ω]"
                  />
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
                  placeholder={useIntl().formatMessage({
                    id: 'misc.units.long.ohm',
                    defaultMessage: 'Ohms [Ω]',
                  })}
                />
                {lastEdits.includes('resistance') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage id="misc.properties.current" defaultMessage="Current [A]" />
                }
              >
                <InputNumber
                  value={current}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onCurrentChange}
                  placeholder={useIntl().formatMessage({
                    id: 'misc.units.long.amp',
                    defaultMessage: 'Amps [A]',
                  })}
                />
                {lastEdits.includes('current') && <LockOutlined />}
              </Form.Item>

              <Form.Item
                label={<FormattedMessage id="misc.properties.power" defaultMessage="Power [W]" />}
              >
                <InputNumber
                  value={power}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={onPowerChange}
                  placeholder={useIntl().formatMessage({
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

export default OhmLaw;
