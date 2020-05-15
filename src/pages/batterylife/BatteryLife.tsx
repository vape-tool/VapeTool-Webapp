import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, InputNumber, Row, Typography } from 'antd';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

const BatteryLife: React.FC = () => {
  const [capacityMah, setCapacityMah] = useState<number | undefined>();
  const [capacityWah, setCapacityWah] = useState<number | undefined>();
  const [power, setPower] = useState<number | undefined>();
  const [puffSeconds, setPuffSeconds] = useState<number | undefined>();
  const [mahLastChanged, setLastChangedMah] = useState<boolean>();

  const [totalRuntime, setTotalRuntime] = useState<string>();

  const [amountOfPuffs, setAmountOfPuffs] = useState<string>();

  function convertToWah(mah: number) {
    return (mah * 3.7) / 1000;
  }
  function convertToMah(wah: number) {
    return (wah * 1000) / 3.7;
  }

  function setResult() {
    let wah: number;

    if (capacityMah !== undefined && power !== undefined) {
      wah = convertToWah(capacityMah);
    } else if (capacityWah !== undefined && power !== undefined) {
      wah = capacityWah;
    } else {
      return;
    }

    setTotalRuntime(`Total runtime: ${Math.round((wah / power) * 60)}`);

    if (puffSeconds !== undefined) {
      setAmountOfPuffs(`Amount of puffs: ${Math.round(((wah / power) * 3600) / puffSeconds)}`);
    }
  }

  const handleCalculate = (e: any) => {
    e.preventDefault();
    if (mahLastChanged && capacityMah !== undefined) {
      setCapacityWah(convertToWah(capacityMah));
    } else if (capacityWah !== undefined) {
      setCapacityMah(convertToMah(capacityWah));
    }
    setResult();
  };

  const handleClear = (e: any) => {
    e.preventDefault();
    [
      setCapacityMah,
      setCapacityWah,
      setPower,
      setPuffSeconds,
      setAmountOfPuffs,
      setTotalRuntime,
    ].forEach(state => {
      state(undefined);
    });
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
                  <FormattedMessage id="misc.properties.capacity" defaultMessage="Capacity [mAh]" />
                }
              >
                <InputNumber
                  value={capacityMah}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={e => {
                    setCapacityMah(e === undefined ? undefined : Number(e));
                    setLastChangedMah(true);
                  }}
                  placeholder={formatMessage({
                    id: 'misc.units.long.batteryLife',
                    defaultMessage: 'Capacity [mAh]',
                  })}
                />
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage id="misc.properties.capacity" defaultMessage="Capacity [Wh]" />
                }
              >
                <InputNumber
                  value={capacityWah}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={e => {
                    setCapacityWah(e === undefined ? undefined : Number(e));
                    setLastChangedMah(false);
                  }}
                  placeholder={formatMessage({
                    id: 'misc.units.long.batteryLife',
                    defaultMessage: 'Capacity [Wh]',
                  })}
                />
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
                  onChange={e => setPower(e === undefined ? undefined : Number(e))}
                  placeholder={formatMessage({
                    id: 'misc.units.long.wat',
                    defaultMessage: 'Wattage [W]',
                  })}
                />
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage
                    id="misc.properties.averagePuffTime"
                    defaultMessage="Average puff time [s]"
                  />
                }
              >
                <InputNumber
                  value={puffSeconds}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={e => setPuffSeconds(e === undefined ? undefined : Number(e))}
                  placeholder={formatMessage({
                    id: 'misc.units.long.puffTime',
                    defaultMessage: 'Average puff time [s]',
                  })}
                />
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
            <Typography>{totalRuntime}</Typography>
            <br />
            <Typography>{amountOfPuffs}</Typography>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect()(BatteryLife);
