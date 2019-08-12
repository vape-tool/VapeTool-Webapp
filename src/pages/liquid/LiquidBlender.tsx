import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, InputNumber, Row, Slider, Table, Typography } from 'antd';
import { connect } from 'dva';
import { Result } from '@vapetool/types';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';
import FlavorTable from '@/components/FlavorTable';

export interface LiquidBlenderProps extends ConnectProps {
  liquid: LiquidModelState;
  dispatch: Dispatch;
}

const resultColumns = [
  {
    title: 'Ingredient',
    dataIndex: 'name',
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
  },
  {
    title: 'Amount',
    dataIndex: 'ml',
  },
  {
    title: 'Drops',
    dataIndex: 'drips',
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
  },
  {
    title: 'Price',
    dataIndex: 'price',
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

  onAddFlavorClick = () => this.props.dispatch({
    type: 'liquid/addEmptyFlavor',
  });

  render() {
    const {
      liquid: { currentLiquid, results },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <Typography.Title level={1}>BASE</Typography.Title>
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


          <br/>
          <br/>
          <Typography.Title level={1}>FLAVORS</Typography.Title>
          <FlavorTable/>
          <Button onClick={this.onAddFlavorClick}>Add Flavor</Button>
          <br/>
          <br/>
          <Typography.Title level={1}>TARGET</Typography.Title>
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
          <br/>
          <br/>
          <Typography.Title level={1}>RESULTS</Typography.Title>
          <Table<Result> columns={resultColumns} dataSource={results}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(LiquidBlender);
