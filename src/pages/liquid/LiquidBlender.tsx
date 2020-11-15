import React, { useState } from 'react';
import { Affix, Button, Card, Col, InputNumber, Row, Table, Typography } from 'antd';
import { FormattedMessage, useModel } from 'umi';
import FlavorTable from '@/components/FlavorTable';
import NewFlavorModal from '@/components/NewFlavorModal';
import VgPgRatioView from '@/components/VgPgRatioView';
import { CalculatorOutlined, PlusOutlined } from '@ant-design/icons';
import { Author } from '@vapetool/types';
import SaveModal from '@/components/SaveModal';
import { saveLiquid } from '@/services/items';
import { LiquidModelState } from '@/models/liquid';
import { CurrentUser } from '@/app';
import { PageContainer } from '@ant-design/pro-layout';
import Banner from '@/components/Banner';
import styles from './LiquidBlender.less';
import LiquidResultsChart from './LiquidResultsChart';

const { Title } = Typography;

export interface LiquidBlenderProps {
  liquid: LiquidModelState;
  user?: CurrentUser;
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

const LiquidBlender = () => {
  const {
    currentLiquid,
    setBaseStrength,
    setBaseRatio,
    setThinner,
    setAmount,
    setTargetStrength,
    setTargetRatio,
    showFlavorModal,
    resultsState,
    calculateResult,
    saveModalVisible,
    setSaveModalVisible,
  } = useModel('liquid');

  const { initialState } = useModel('@@initialState');
  const [calculateBtnLoading, setCalculateBtnLoading] = useState(false);
  const user = initialState?.currentUser as CurrentUser;

  const onBaseStrengthChange = (value: number) => setBaseStrength(value);

  const onBaseRatioChange = (value: any) =>
    value && typeof value === 'number' && setBaseRatio(100 - value);

  const onThinnerChange = (value: number) => setThinner(value);

  const onAmountChange = (value: number) => setAmount(value);

  const onTargetStrengthChange = (value: number) => setTargetStrength(value);

  const onTargetRatioChange = (value: any) =>
    value && typeof value === 'number' && setTargetRatio(100 - value);

  const showNewFlavorModal = () => showFlavorModal();

  const onCalculateClick = () => {
    setCalculateBtnLoading(true);
    calculateResult().finally(() => setCalculateBtnLoading(false));
  };

  const responsivenessProps = { xs: 24, xl: 8 };
  const responsivenessCollections = { xs: 24, xl: 16 };

  return (
    <PageContainer>
      <Row justify="center" gutter={32}>
        <div style={{ marginBottom: '2%' }}>
          <Banner providerName="liquid_blender_top_ad_provider" />
        </div>
        <Col xs={24} sm={20} md={20}>
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
                        // @ts-ignore
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
                    // @ts-ignore
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
                        // @ts-ignore
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
                        // @ts-ignore
                        onChange={onTargetStrengthChange}
                      />
                    </label>
                  </Col>
                </Row>

                <Title level={4}>
                  <FormattedMessage id="liquid.targetRatio" defaultMessage="Target ratio" />
                </Title>
                <VgPgRatioView
                  onRatioChange={onTargetRatioChange}
                  ratio={currentLiquid.targetRatio}
                />
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
                        loading={calculateBtnLoading}
                        onClick={() => onCalculateClick()}
                      >
                        <FormattedMessage id="misc.actions.calculate" defaultMessage="Calculate" />
                      </Button>
                    </Affix>
                    {resultsState && (
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
                  rowKey={(result) => result.name}
                  columns={resultColumns}
                  pagination={false}
                  dataSource={
                    resultsState
                      ? resultsState.map((result) => ({
                          name: result.name,
                          percentage: `${result.percentage.toFixed(1)}%`,
                          ml: `${result.ml.toFixed(1)} ml`,
                          drips: result.drips.toFixed(0),
                          price: `${result.price.toFixed(2)}$`,
                          weight: `${result.weight.toFixed(3)}g`,
                        }))
                      : []
                  }
                />

                <div className={styles.chartPanel}>
                  {resultsState && <LiquidResultsChart results={resultsState} />}
                </div>
              </Card>
            </Col>
          </Row>
          <NewFlavorModal />
        </Col>
        <div style={{ marginTop: '2%' }}>
          <Banner providerName="liquid_blender_bottom_ad_provider" />
        </div>
      </Row>
    </PageContainer>
  );
};

export default LiquidBlender;
