import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, InputNumber, Row, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import ButtonGroup from 'antd/es/button/button-group';
import { verifyCurrentUser } from '@/services';
import Banner from '@/components/Banner';

const BatteryLife: React.FC = () => {
  const [capacityMah, setCapacityMah] = useState<number | undefined>();
  const [capacityWh, setCapacityWh] = useState<number | undefined>();
  const [power, setPower] = useState<number | undefined>();
  const [puffSeconds, setPuffSeconds] = useState<number | undefined>();
  const [mahLastChanged, setLastChangedMah] = useState<boolean>();
  const [totalRuntime, setTotalRuntime] = useState<string>();
  const [amountOfPuffs, setAmountOfPuffs] = useState<string>();

  const convertToMah = (wh: number) => (wh * 1000) / 3.7;
  const convertToWh = (mah: number) => (mah * 3.7) / 1000;

  function setResult() {
    let wh: number;

    if (capacityMah && power) {
      wh = convertToWh(capacityMah);
    } else if (capacityWh && power) {
      wh = capacityWh;
    } else {
      return;
    }

    setTotalRuntime(`Total runtime: ${Math.round((wh / power) * 60)}`);

    if (puffSeconds) {
      setAmountOfPuffs(`Amount of puffs: ${Math.round(((wh / power) * 3600) / puffSeconds)}`);
    }
  }

  const handleCalculate = (e: any) => {
    if (!verifyCurrentUser()) return;
    e.preventDefault();
    if (mahLastChanged && capacityMah) {
      setCapacityWh(convertToWh(capacityMah));
    } else if (capacityWh) {
      setCapacityMah(convertToMah(capacityWh));
    }
    setResult();
  };

  const handleClear = (e: any) => {
    e.preventDefault();
    [
      setCapacityMah,
      setCapacityWh,
      setPower,
      setPuffSeconds,
      setAmountOfPuffs,
      setTotalRuntime,
    ].forEach((state) => {
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
          <div style={{ marginBottom: '2%' }}>
            <Banner providerName="batteries_life_ad_provider" />
          </div>
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
                  onChange={(e) => {
                    setCapacityMah(e === undefined ? undefined : Number(e));
                    setLastChangedMah(true);
                  }}
                  placeholder={useIntl().formatMessage({
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
                  value={capacityWh}
                  size="large"
                  step={0.1}
                  min={0.01}
                  precision={2}
                  style={{ width: '100%', maxWidth: 200 }}
                  onChange={(e) => {
                    setCapacityWh(e === undefined ? undefined : Number(e));
                    setLastChangedMah(false);
                  }}
                  placeholder={useIntl().formatMessage({
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
                  onChange={(e) => setPower(e === undefined ? undefined : Number(e))}
                  placeholder={useIntl().formatMessage({
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
                  onChange={(e) => setPuffSeconds(e === undefined ? undefined : Number(e))}
                  placeholder={useIntl().formatMessage({
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

export default BatteryLife;
