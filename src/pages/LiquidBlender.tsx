import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, InputNumber, Row, Slider, Table, Typography } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';

export interface LiquidBlenderProps extends ConnectProps {
  liquid: LiquidModelState;
  dispatch: Dispatch;
}

const flavorColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturer',
  },
  {
    title: 'Percentage [%]',
    dataIndex: 'percentage',
  },
  {
    title: 'Price [$]',
    dataIndex: 'price',
  },
  {
    title: 'Amount [ml]',
    dataIndex: 'amount',
  },
];

const resultColumns = [
  {
    title: 'Ingredient',
    dataIndex: 'name',
  },
];

class LiquidBlender extends React.Component<LiquidBlenderProps> {
  onBaseStrengthChange = (value: number | undefined): void =>
    value &&
    this.props.dispatch({
      type: 'liquid/setBaseStrength',
      payload: value,
    });

  onBaseRatioChange = (value: any) =>
    value &&
    typeof value === 'number' &&
    this.props.dispatch({
      type: 'liquid/setBaseRatio',
      payload: 100 - value,
    });

  onThinnerChange = (value: number | undefined): void =>
    value &&
    this.props.dispatch({
      type: 'liquid/setThinner',
      payload: value,
    });

  onAmountChange = (value: number | undefined): void =>
    value &&
    this.props.dispatch({
      type: 'liquid/setAmount',
      payload: value,
    });

  onTargetStrengthChange = (value: number | undefined): void =>
    value &&
    this.props.dispatch({
      type: 'liquid/setTargetStrength',
      payload: value,
    });

  onTargetRatioChange = (value: any) =>
    value &&
    typeof value === 'number' &&
    this.props.dispatch({
      type: 'liquid/setTargetRatio',
      payload: 100 - value,
    });

  render() {
    const {
      liquid: { currentLiquid, results },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <Typography.Title level={2}>BASE</Typography.Title>
          <Typography.Title level={4}>Nicotine strength</Typography.Title>
          <InputNumber
            min={0.0}
            step={1}
            value={currentLiquid.baseStrength}
            onChange={this.onBaseStrengthChange}
          />

          <Typography.Title level={4}>
            Base Vegetable Glycerin and Propylene Glycol Ratio
          </Typography.Title>
          <Row>
            <Col span={2}>
              <InputNumber
                min={0}
                max={100}
                step={5}
                style={{ marginRight: 16 }}
                value={100 - currentLiquid.baseRatio}
                onChange={this.onBaseRatioChange}
              />
            </Col>
            <Col span={12}>
              <Slider
                step={5}
                min={0}
                max={100}
                onChange={this.onBaseRatioChange}
                value={100 - currentLiquid.baseRatio}
              />
            </Col>
            <Col span={2}>
              <InputNumber
                min={0}
                max={100}
                step={5}
                style={{ marginLeft: 16 }}
                value={currentLiquid.baseRatio}
                onChange={(value: number | undefined) =>
                  value && this.onBaseRatioChange(100 - value)
                }
              />
            </Col>
          </Row>
          <Typography.Title level={4}>Thinner</Typography.Title>
          <InputNumber
            min={0.0}
            step={1}
            value={currentLiquid.thinner}
            onChange={this.onThinnerChange}
          />

          <Typography.Title level={2}>FLAVORS</Typography.Title>
          <Table columns={flavorColumns} dataSource={currentLiquid.flavors}/>

          <Typography.Title level={2}>TARGET</Typography.Title>
          <Typography.Title level={4}>Amount</Typography.Title>
          <InputNumber
            min={0.0}
            step={1}
            value={currentLiquid.amount}
            onChange={this.onAmountChange}
          />
          <Typography.Title level={4}>Target strength</Typography.Title>
          <InputNumber
            min={0.0}
            step={1}
            value={currentLiquid.targetStrength}
            onChange={this.onTargetStrengthChange}
          />
          <Typography.Title level={4}>
            Target Vegetable Glycerin and Propylene Glycol Ratio
          </Typography.Title>
          <Row>
            <Col span={2}>
              <InputNumber
                min={0}
                max={100}
                step={5}
                style={{ marginRight: 16 }}
                value={100 - currentLiquid.targetRatio}
                onChange={this.onTargetRatioChange}
              />
            </Col>
            <Col span={12}>
              <Slider
                step={5}
                min={0}
                max={100}
                onChange={this.onTargetRatioChange}
                value={100 - currentLiquid.targetRatio}
              />
            </Col>
            <Col span={2}>
              <InputNumber
                min={0}
                max={100}
                step={5}
                style={{ marginLeft: 16 }}
                value={currentLiquid.targetRatio}
                onChange={(value: number | undefined) =>
                  value && this.onTargetRatioChange(100 - value)
                }
              />
            </Col>
          </Row>

          <Table columns={resultColumns} dataSource={results}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(LiquidBlender);
