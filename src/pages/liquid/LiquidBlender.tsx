import React from 'react';
import { Affix, Button, Card, Col, InputNumber, Row, Table, Typography } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';
import FlavorTable from '@/components/FlavorTable';
import NewFlavorModal from '@/components/NewFlavorModal';
import { unitFormatter, unitParser } from '@/utils/utils';
import VgPgRatioView from '@/components/VgPgRatioView';
import styles from './LiquidBlender.less';

const { Title } = Typography;

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

  showNewFlavorModal = () =>
    this.props.dispatch({
      type: 'liquid/showNewFlavorModal',
    });

  onCalculateClick = () =>
    this.props.dispatch({
      type: 'liquid/calculateResults',
    });

  render() {
    const {
      liquid: { currentLiquid, results },
    } = this.props;
    const responsivenessProps = { xs: 24, xl: 8 };
    const responsivenessCollections = { xs: 24, xl: 16 };

    return (
      <div>
        <Row type="flex" style={{ alignItems: 'stretch' }} justify="center" className={styles.root}>
          <Col {...responsivenessProps}>
            <Card title={<Title level={1}>Base</Title>} style={{ height: '100%' }}>
              <Row type="flex">
                <Col xs={24}>
                  <Title level={4}>Nicotine strength</Title>
                </Col>
                <Col xs={24}>
                  <InputNumber
                    min={0.0}
                    step={1}
                    formatter={unitFormatter(0, 'mg/ml')}
                    parser={unitParser('mg/ml')}
                    value={currentLiquid.baseStrength}
                    onChange={this.onBaseStrengthChange}
                  />
                </Col>
              </Row>

              <Title level={4}>Base Ratio</Title>
              <VgPgRatioView
                onRatioChange={this.onBaseRatioChange}
                ratio={currentLiquid.baseRatio}
              />
              <Title level={4}>Thinner</Title>
              <InputNumber
                min={0.0}
                step={1}
                formatter={unitFormatter(1, '%')}
                parser={unitParser('%')}
                value={currentLiquid.thinner}
                onChange={this.onThinnerChange}
              />
            </Card>
          </Col>
          <Col {...responsivenessCollections}>
            <Card title={<Title level={1}>Flavors</Title>}>
              <FlavorTable />
              <Button
                type="dashed"
                icon="plus"
                size="large"
                style={{ width: '100%' }}
                onClick={this.showNewFlavorModal}
              >
                Add Flavor
              </Button>
            </Card>
          </Col>
          <Col {...responsivenessProps}>
            <Card title={<Title level={1}>Target</Title>} style={{ height: '100%' }}>
              <Row type="flex" justify="space-between">
                <Col xs={8} xl={10}>
                  <Title level={4}>Amount</Title>
                  <InputNumber
                    min={0.0}
                    step={1}
                    formatter={unitFormatter(0, 'ml')}
                    parser={unitParser('ml')}
                    value={currentLiquid.amount}
                    onChange={this.onAmountChange}
                  />
                </Col>
                <Col xs={16} xl={14}>
                  <Title level={4}>Target strength</Title>
                  <InputNumber
                    min={0.0}
                    step={1}
                    formatter={unitFormatter(0, 'mg/ml')}
                    parser={unitParser('mg/ml')}
                    value={currentLiquid.targetStrength}
                    onChange={this.onTargetStrengthChange}
                  />
                </Col>
              </Row>
              <Title level={4}>Target Ratio</Title>
              <VgPgRatioView
                onRatioChange={this.onTargetRatioChange}
                ratio={currentLiquid.targetRatio}
              />
            </Card>
          </Col>
          <Col {...responsivenessCollections}>
            <Card
              title={<Title level={1}>Results</Title>}
              extra={
                <Affix offsetBottom={50}>
                  <Button
                    type="primary"
                    icon="calculator"
                    shape="round"
                    size="large"
                    onClick={this.onCalculateClick}
                  >
                    Calculate
                  </Button>
                </Affix>
              }
            >
              <Table
                rowKey={result => result.name}
                columns={resultColumns}
                pagination={false}
                dataSource={
                  results
                    ? results.map(result => ({
                        name: result.name,
                        percentage: `${result.percentage.toFixed(1)}%`,
                        ml: `${result.ml.toFixed(1)} ml`,
                        drips: result.drips.toFixed(0),
                        price: `${result.price.toFixed(2)}${formatMessage({ id: 'app.currency' })}`,
                        weight: `${result.weight.toFixed(3)} g`,
                      }))
                    : []
                }
              />
            </Card>
          </Col>
        </Row>
        <NewFlavorModal />
      </div>
    );
  }
}

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(LiquidBlender);
