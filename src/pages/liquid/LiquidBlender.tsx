import React from 'react';
import { Affix, Button, Card, Col, InputNumber, Row, Table, Typography } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import {
  LiquidModelState,
  dispatchShowNewFlavorModal,
  dispatchSetTargetRatio,
  dispatchSetTargetStrength,
  dispatchSetAmount,
  dispatchSetThinner,
  dispatchSetBaseRatio,
  dispatchSetBaseStrength,
  dispatchCalculateResults,
} from '@/models/liquid';
import FlavorTable from '@/components/FlavorTable';
import NewFlavorModal from '@/components/NewFlavorModal';
import { unitFormatter, unitParser } from '@/utils/utils';
import VgPgRatioView from '@/components/VgPgRatioView';
import styles from './LiquidBlender.less';

const { Title } = Typography;

export interface LiquidBlenderProps {
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
const LiquidBlender: React.FC<LiquidBlenderProps> = ({
  dispatch,
  liquid: { currentLiquid, results },
}) => {
  const onBaseStrengthChange = (value: number | undefined) =>
    dispatchSetBaseStrength(dispatch, value);

  const onBaseRatioChange = (value: any) =>
    value && typeof value === 'number' && dispatchSetBaseRatio(dispatch, 100 - value);

  const onThinnerChange = (value: number | undefined) => dispatchSetThinner(dispatch, value);

  const onAmountChange = (value: number | undefined) => dispatchSetAmount(dispatch, value);

  const onTargetStrengthChange = (value: number | undefined) =>
    dispatchSetTargetStrength(dispatch, value);

  const onTargetRatioChange = (value: any) =>
    value && typeof value === 'number' && dispatchSetTargetRatio(dispatch!, 100 - value);

  const showNewFlavorModal = () => dispatchShowNewFlavorModal(dispatch);

  const onCalculateClick = () => dispatchCalculateResults(dispatch);

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
                  onChange={onBaseStrengthChange}
                />
              </Col>
            </Row>

            <Title level={4}>Base Ratio</Title>
            <VgPgRatioView onRatioChange={onBaseRatioChange} ratio={currentLiquid.baseRatio} />
            <Title level={4}>Thinner</Title>
            <InputNumber
              min={0.0}
              step={1}
              formatter={unitFormatter(1, '%')}
              parser={unitParser('%')}
              value={currentLiquid.thinner}
              onChange={onThinnerChange}
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
              onClick={showNewFlavorModal}
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
                  onChange={onAmountChange}
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
                  onChange={onTargetStrengthChange}
                />
              </Col>
            </Row>
            <Title level={4}>Target Ratio</Title>
            <VgPgRatioView onRatioChange={onTargetRatioChange} ratio={currentLiquid.targetRatio} />
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
                  onClick={onCalculateClick}
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
};

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(LiquidBlender);
