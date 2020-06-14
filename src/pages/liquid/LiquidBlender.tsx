import React, { useState } from 'react';
import { Affix, Button, Card, Col, InputNumber, Row, Table, Typography } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import {
  dispatchCalculateResults,
  dispatchSetAmount,
  dispatchSetBaseRatio,
  dispatchSetBaseStrength,
  dispatchSetTargetRatio,
  dispatchSetTargetStrength,
  dispatchSetThinner,
  dispatchShowNewFlavorModal,
  LiquidModelState,
} from '@/models/liquid';
import FlavorTable from '@/components/FlavorTable';
import NewFlavorModal from '@/components/NewFlavorModal';
import VgPgRatioView from '@/components/VgPgRatioView';
import { CalculatorOutlined, PlusOutlined } from '@ant-design/icons';
import { Author } from '@vapetool/types';
import styles from './LiquidBlender.less';
import LiquidResultsChart from './LiquidResultsChart';
import { CurrentUser } from '@/models/user';
import SaveModal from '@/components/SaveModal';
import { saveLiquid } from '@/services/items';

const { Title } = Typography;

export interface LiquidBlenderProps {
  liquid: LiquidModelState;
  user?: CurrentUser;
  dispatch: Dispatch;
}

const resultColumns = [
  {
    title: <FormattedMessage id="liquid.ingredient" defaultMessage="Ingredient" />,
    dataIndex: 'name',
  },
  {
    title: <FormattedMessage id="misc.units.percentage" defaultMessage="Percentage" />,
    dataIndex: 'percentage',
  },
  {
    title: <FormattedMessage id="liquid.amount" defaultMessage="Amount" />,
    dataIndex: 'ml',
  },
  {
    title: <FormattedMessage id="liquid.drops" defaultMessage="Drops" />,
    dataIndex: 'drips',
  },
  {
    title: <FormattedMessage id="misc.properties.weight" defaultMessage="Weight" />,
    dataIndex: 'weight',
  },
  {
    title: <FormattedMessage id="misc.properties.price" defaultMessage="Price" />,
    dataIndex: 'price',
  },
];

const LiquidBlender: React.FC<LiquidBlenderProps> = ({
  dispatch,
  liquid: { currentLiquid, results },
  user,
}) => {
  const [saveModalVisible, setSaveModalVisible] = useState(false);

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
      <SaveModal
        visible={saveModalVisible}
        setVisible={setSaveModalVisible}
        save={async (name, description) => {
          if (user && user.uid && user.name) {
            saveLiquid(currentLiquid, new Author(user.uid, user.name), name, description || '');
          } else {
            throw new Error('Can not save with undefined user ');
          }
        }}
      />
      <Row style={{ alignItems: 'stretch' }} justify="center" className={styles.root}>
        <Col {...responsivenessProps}>
          <Card
            title={
              <Title level={1}>
                <FormattedMessage id="liquid.titles.base" defaultMessage="Base" />
              </Title>
            }
            style={{ height: '100%' }}
          >
            <Row>
              <Col xs={24}>
                <label>
                  <FormattedMessage
                    id="liquid.nicotineStrength"
                    defaultMessage="Nicotine strength [mg/ml]"
                  />
                  <InputNumber
                    min={0.0}
                    step={1}
                    precision={0}
                    value={currentLiquid.baseStrength}
                    onChange={onBaseStrengthChange}
                  />
                </label>
              </Col>
            </Row>

            <Title level={4}>
              <FormattedMessage id="liquid.baseRatio" defaultMessage="Base ratio" />
            </Title>
            <VgPgRatioView onRatioChange={onBaseRatioChange} ratio={currentLiquid.baseRatio} />

            <label>
              <FormattedMessage id="liquid.thinner" defaultMessage="Thinner [%]" />
              <InputNumber
                min={0.0}
                step={1}
                precision={1}
                value={currentLiquid.thinner}
                onChange={onThinnerChange}
              />
            </label>
          </Card>
        </Col>

        <Col {...responsivenessCollections}>
          <Card
            className={styles.noPadding}
            title={
              <Title level={1}>
                <FormattedMessage id="liquid.titles.flavors" defaultMessage="Flavors" />
              </Title>
            }
          >
            <FlavorTable />

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              size="large"
              style={{ width: '100%' }}
              onClick={showNewFlavorModal}
            >
              <FormattedMessage id="liquid.actions.addFlavor" defaultMessage="Add new Flavor" />
            </Button>
          </Card>
        </Col>

        <Col {...responsivenessProps}>
          <Card
            title={
              <Title level={1}>
                <FormattedMessage id="liquid.titles.target" defaultMessage="Target" />
              </Title>
            }
            style={{ height: '100%' }}
          >
            <Row justify="space-between">
              <Col xs={8} xl={10}>
                <label>
                  <FormattedMessage id="liquid.amount" defaultMessage="Amount [ml]" />
                  <InputNumber
                    min={0.0}
                    step={1}
                    precision={0}
                    value={currentLiquid.amount}
                    onChange={onAmountChange}
                  />
                </label>
              </Col>

              <Col xs={16} xl={14}>
                <label>
                  <FormattedMessage
                    id="liquid.targetStrength"
                    defaultMessage="Target strength [mg/ml]"
                  />
                  <InputNumber
                    min={0.0}
                    step={1}
                    precision={0}
                    value={currentLiquid.targetStrength}
                    onChange={onTargetStrengthChange}
                  />
                </label>
              </Col>
            </Row>

            <Title level={4}>
              <FormattedMessage id="liquid.targetRatio" defaultMessage="Target ratio" />
            </Title>
            <VgPgRatioView onRatioChange={onTargetRatioChange} ratio={currentLiquid.targetRatio} />
          </Card>
        </Col>

        <Col {...responsivenessCollections}>
          <Card
            className={styles.noPadding}
            title={
              <Title level={1}>
                <FormattedMessage id="liquid.titles.results" defaultMessage="Results" />
              </Title>
            }
            extra={
              <Row>
                <Affix offsetBottom={50}>
                  <Button
                    type="primary"
                    icon={<CalculatorOutlined />}
                    shape="round"
                    size="large"
                    onClick={onCalculateClick}
                  >
                    <FormattedMessage id="misc.actions.calculate" defaultMessage="Calculate" />
                  </Button>
                </Affix>
                {results && (
                  <Affix offsetBottom={50}>
                    <Button
                      icon={<CalculatorOutlined />}
                      shape="round"
                      size="large"
                      onClick={() => setSaveModalVisible(true)}
                    >
                      <FormattedMessage id="misc.actions.save" defaultMessage="Save" />
                    </Button>
                  </Affix>
                )}
              </Row>
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
                      price: `${result.price.toFixed(2)}${formatMessage({
                        id: 'app.currency',
                        defaultMessage: '$',
                      })}`,
                      weight: `${result.weight.toFixed(3)} ${formatMessage({
                        id: 'misc.units.gram',
                        defaultMessage: 'g',
                      })}`,
                    }))
                  : []
              }
            />

            <div className={styles.chartPanel}>
              {results && <LiquidResultsChart results={results} />}
            </div>
          </Card>
        </Col>
      </Row>
      <NewFlavorModal />
    </div>
  );
};

export default connect(({ liquid, user }: ConnectState) => ({
  liquid,
  user: user.currentUser,
}))(LiquidBlender);
