import React, { useState } from 'react';
import { Button, Card, Col, InputNumber, Row, Select, Typography, Carousel, message } from 'antd';
import { FormattedMessage, useModel } from 'umi';
import { Coil, Properties, Wire, Author } from '@vapetool/types';
import { Coil as CoilType } from '@/types';
import ComplexWire from '@/components/ComplexWire';
import PropertyItem from '@/components/PropertyItem';
import {
  CalculatorOutlined,
  LockFilled,
  UnlockOutlined,
  QuestionCircleFilled,
  SaveOutlined,
} from '@ant-design/icons';
import { isProUser } from '@/utils/utils';
import CoilHelper from '@/components/CoilHelper';
import { CurrentUser } from '@/app';
import { saveCoil } from '@/services/items';
import SaveModal from '@/components/SaveModal';
import { sendRequest } from '@/services/coil';
import { Path } from '@/models/coil';
import { PageContainer } from '@ant-design/pro-layout';
import Banner from '@/components/Banner';
import styles from './styles.less';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps {
  coil: Coil;
  properties?: Properties;
  baseVoltage: number;
  isPro: boolean;
  user?: CurrentUser;
}

enum Field {
  SETUP = 'SETUP',
  INNER_DIAMETER = 'INNER_DIAMETER',
  LEGS_LENGTH = 'LEGS_LENGTH',
  RESISTANCE = 'RESISTANCE',
  WRAPS = 'WRAPS',
  VOLTAGE = 'VOLTAGE',
}

const CoilCalculator: React.FC<CoilCalculatorProps> = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const isPro = isProUser(currentUser?.subscription);

  const {
    currentCoil,
    properties,
    baseVoltage,
    setCoilType,
    setBaseVoltage,
    setSetup,
    setInnerDiameter,
    setLegsLength,
    setResistance,
    setWraps,
    calculateForResistance,
    calculateForWraps,
    addWire,
    deleteWire,
    setWire,
  } = useModel('coil');

  const [lastEdit, setLastEdit] = useState('resistance');
  const [helpModalVisibile, setHelpModalVisible] = useState(false);
  const [slider, setSlider] = useState<Carousel>();
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [calculateBtnLoading, setCalculateBtnLoading] = useState(false);

  const onValueChanged = (field: Field) => (value?: number | string) => {
    if (field === Field.WRAPS || field === Field.RESISTANCE) {
      setLastEdit(field);
    }

    if (value !== undefined && !Number.isNaN(value)) {
      const FIELD_TO_METHOD_MAP = {
        [Field.SETUP]: setSetup,
        [Field.INNER_DIAMETER]: setInnerDiameter,
        [Field.LEGS_LENGTH]: setLegsLength,
        [Field.RESISTANCE]: setResistance,
        [Field.WRAPS]: setWraps,
        [Field.VOLTAGE]: setBaseVoltage,
      };
      FIELD_TO_METHOD_MAP[field](Number(value));
    }
  };

  const onSetupChange = (value: string) => onValueChanged(Field.SETUP)(value);
  const onInnerDiameterChange = onValueChanged(Field.INNER_DIAMETER);
  const onLegsLengthChange = onValueChanged(Field.LEGS_LENGTH);
  const onResistanceChange = onValueChanged(Field.RESISTANCE);
  const onWrapsChange = onValueChanged(Field.WRAPS);

  const calculate = (): void => {
    const calculationFn = lastEdit === Field.WRAPS ? calculateForResistance : calculateForWraps;
    setCalculateBtnLoading(true);
    calculationFn().finally(() => setCalculateBtnLoading(false));
  };

  const onBaseVoltageChange = (value?: number | string) => {
    onValueChanged(Field.VOLTAGE)(Number(value));
    calculate();
  };

  const toggleLock = () => {
    setLastEdit(lastEdit === 'resistance' ? 'wraps' : 'resistance');
  };

  const handleWireTypeChange = (type: number, path: Path[]): void => setCoilType(type, path);
  const handleAddWire = (path: Path[], wire: Wire) => addWire(wire, path);
  const handleSetWire = (path: Path[], wire: Wire) => setWire(wire, path);
  const handleDeleteWire = (path: Path[]) => deleteWire(path);

  const validateAndSaveCoil = async (name: string, description?: string) => {
    const res = await sendRequest(
      lastEdit === 'resistance' ? 'wraps' : 'resistance',
      currentCoil as CoilType,
    );
    if (res instanceof Response && !res.ok) {
      message.error("Couldn't save coil");
      return;
    }
    if (currentUser && currentUser.uid && currentUser.name) {
      saveCoil(currentCoil, new Author(currentUser.uid, currentUser.name), name, description || '');
    } else {
      throw new Error('Can not save with undefined user ');
    }
  };

  // {{descriptionItem('Total width', 'totalWidth', 'mm')}}  //TODO fix it
  // {{descriptionItem('Total height', 'totalHeight', 'mm')}} //TODO fix it
  const coilProperties = (
    <Col xs={24}>
      <PropertyItem
        property="baseVoltage"
        value={baseVoltage}
        unit="V"
        editable
        onChangeValue={onBaseVoltageChange}
        isPro={isPro}
      />
      <PropertyItem property="current" value={properties?.current} unit="A" isPro={isPro} />
      <PropertyItem property="power" value={properties?.power} unit="W" isPro={isPro} />
      <PropertyItem property="heat" value={properties?.heat} unit="mW/cm²" proOnly isPro={isPro} />
      <PropertyItem
        property="surface"
        value={properties?.surface}
        unit="cm²"
        proOnly
        isPro={isPro}
      />
      <PropertyItem
        property="totalLength"
        value={properties?.totalLength}
        unit="mm"
        proOnly
        isPro={isPro}
      />
    </Col>
  );

  const coilSetup = (
    <Card style={{ height: '100%' }}>
      <SaveModal
        visible={saveModalVisible}
        setVisible={setSaveModalVisible}
        save={validateAndSaveCoil}
      />
      <Row>
        <Col xs={24}>
          <label>
            <FormattedMessage id="coilCalculator.inputs.setup" />
            <Select defaultValue={`${currentCoil.setup}`} onChange={onSetupChange}>
              <Option value="1">Single Coil (1)</Option>
              <Option value="2">Dual Coil (2)</Option>
              <Option value="3">Triple Coil (3)</Option>
              <Option value="4">Quad Coil (4)</Option>
            </Select>
          </label>
          <QuestionCircleFilled
            style={{ fontSize: 32, float: 'right', textAlign: 'center' }}
            onClick={() => setHelpModalVisible(true)}
          />
        </Col>

        <Col xs={24}>
          <label>
            <FormattedMessage id="coilCalculator.inputs.innerDiameter" />
            <InputNumber
              min={0.0}
              step={0.1}
              precision={1}
              defaultValue={currentCoil.innerDiameter}
              value={currentCoil.innerDiameter}
              onChange={onInnerDiameterChange}
            />
          </label>
        </Col>

        <Col xs={24}>
          <label>
            <FormattedMessage id="coilCalculator.inputs.legsLength" />
            <InputNumber
              min={0.0}
              step={1}
              precision={0}
              value={currentCoil.legsLength}
              onChange={onLegsLengthChange}
            />
          </label>
        </Col>

        <Col xs={24}>
          <Row>
            <div style={{ marginRight: 32 }}>
              <label>
                <FormattedMessage id="coilCalculator.inputs.resistance" />
                <InputNumber
                  min={0.0}
                  step={0.05}
                  precision={3}
                  value={currentCoil.resistance}
                  onChange={onResistanceChange}
                />
              </label>
              <span className={styles.lockIcon} onClick={toggleLock}>
                {lastEdit === 'resistance' ? <LockFilled /> : <UnlockOutlined />}
              </span>
            </div>
            <div>
              <label>
                <FormattedMessage id="coilCalculator.inputs.wraps" />
                <InputNumber
                  min={0}
                  step={1}
                  precision={0}
                  value={currentCoil.wraps}
                  onChange={onWrapsChange}
                />
              </label>
              <span className={styles.lockIcon} onClick={toggleLock}>
                {lastEdit === 'wraps' ? <LockFilled /> : <UnlockOutlined />}
              </span>
            </div>
          </Row>
        </Col>

        <Col xs={24} style={{ marginTop: 20 }}>
          <Button
            type="primary"
            icon={<CalculatorOutlined />}
            size="large"
            onClick={calculate}
            loading={calculateBtnLoading}
          >
            {' '}
            <FormattedMessage id="coilCalculator.inputs.calculate" />
          </Button>{' '}
          <Button icon={<SaveOutlined />} size="large" onClick={() => setSaveModalVisible(true)}>
            {' '}
            <FormattedMessage id="misc.actions.save" defaultMessage="Save" />
          </Button>
        </Col>

        <Col xs={24} style={{ marginTop: 20 }}>
          {coilProperties}
        </Col>
      </Row>
    </Card>
  );

  const coilSchema = (
    <Card title={<Title level={4}>Type</Title>} style={{ height: '100%' }}>
      <ComplexWire
        complexWire={currentCoil}
        path={[]}
        isPro={isPro}
        onSetWireType={handleWireTypeChange}
        onSetInnerDiameter={onInnerDiameterChange}
        onAddWire={handleAddWire}
        onSetWire={handleSetWire}
        onDeleteWire={handleDeleteWire}
      />
    </Card>
  );

  return (
    <PageContainer>
      <Row justify="center" gutter={32}>
        <div style={{ marginBottom: '2%' }}>
          <Banner providerName="coil_calculator_ad_provider" />
        </div>
        <Col xs={24} sm={20} md={20}>
          <CoilHelper
            setSlider={setSlider}
            helpModalVisible={helpModalVisibile}
            setHelpModalVisible={setHelpModalVisible}
            slider={slider}
          />
          <Row style={{}} justify="center">
            <Col xs={{ span: 24, order: 2 }} xl={{ span: 8, order: 1 }}>
              {coilSetup}
            </Col>
            <Col xs={{ span: 24, order: 1 }} xl={{ span: 16, order: 2 }}>
              {coilSchema}
            </Col>
          </Row>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CoilCalculator;
