import React, { useState } from 'react';
import { Button, Card, Col, InputNumber, Row, Select, Typography, Carousel } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Coil, Properties, Wire } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';
import PropertyItem from '@/components/PropertyItem';
import {
  CALCULATE_FOR_RESISTANCE,
  CALCULATE_FOR_WRAPS,
  COIL,
  dispatchAddWire,
  dispatchDeleteWire,
  dispatchSetCoilType,
  dispatchSetWire,
  Path,
  SET_INNER_DIAMETER,
  SET_LEGS_LENGTH,
  SET_RESISTANCE,
  SET_SETUP,
  SET_VOLTAGE,
  SET_WRAPS,
} from '@/models/coil';
import {
  CalculatorOutlined,
  LockFilled,
  UnlockOutlined,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { isProUser } from '@/pages/login/utils/utils';
import styles from './styles.less';
import CoilHelper from '@/components/CoilHelper';
import saveCoil from './saveCoil';
import { UserModelState } from '@/models/user';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps extends ConnectProps {
  coil: Coil;
  properties?: Properties;
  baseVoltage: number;
  isPro: boolean;
  user: UserModelState;
}

enum Field {
  SETUP = 'SETUP',
  INNER_DIAMETER = 'INNER_DIAMETER',
  LEGS_LENGTH = 'LEGS_LENGTH',
  RESISTANCE = 'RESISTANCE',
  WRAPS = 'WRAPS',
  VOLTAGE = 'VOLTAGE',
}

const FIELD_TO_METHOD_MAP = {
  [Field.SETUP]: SET_SETUP,
  [Field.INNER_DIAMETER]: SET_INNER_DIAMETER,
  [Field.LEGS_LENGTH]: SET_LEGS_LENGTH,
  [Field.RESISTANCE]: SET_RESISTANCE,
  [Field.WRAPS]: SET_WRAPS,
  [Field.VOLTAGE]: SET_VOLTAGE,
};

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil, properties, baseVoltage, isPro, user } = props;

  const [lastEdit, setLastEdit] = useState('resistance');
  const [helpModalVisibile, setHelpModalVisible] = useState(false);
  const [slider, setSlider] = useState<Carousel>();

  if (!dispatch) {
    return <div />;
  }

  const onValueChanged = (field: Field) => (value?: number) => {
    if (field === Field.WRAPS || field === Field.RESISTANCE) {
      setLastEdit(field);
    }

    if (value !== undefined && !Number.isNaN(value)) {
      dispatch({
        type: `${COIL}/${FIELD_TO_METHOD_MAP[field]}`,
        payload: value,
      });
    }
  };

  const onSetupChange = ({ key }: { key: string }) => onValueChanged(Field.SETUP)(Number(key));
  const onInnerDiameterChange = onValueChanged(Field.INNER_DIAMETER);
  const onLegsLengthChange = onValueChanged(Field.LEGS_LENGTH);
  const onResistanceChange = onValueChanged(Field.RESISTANCE);
  const onWrapsChange = onValueChanged(Field.WRAPS);

  const calculate = (): void => {
    if (lastEdit === Field.WRAPS) {
      dispatch({
        type: `${COIL}/${CALCULATE_FOR_RESISTANCE}`,
        coil,
      });
    } else {
      // default
      dispatch({
        type: `${COIL}/${CALCULATE_FOR_WRAPS}`,
        coil,
      });
    }
  };

  const onBaseVoltageChange = (value?: number) => {
    onValueChanged(Field.VOLTAGE)(value);
    calculate();
  };

  const toggleLock = () => {
    setLastEdit(lastEdit === 'resistance' ? 'wraps' : 'resistance');
  };

  const handleWireTypeChange = (type: string, path: Path[]): void =>
    dispatchSetCoilType(dispatch, type, path);
  const handleAddWire = (path: Path[], wire: Wire) => dispatchAddWire(dispatch, path, wire);
  const handleSetWire = (path: Path[], wire: Wire) => dispatchSetWire(dispatch, path, wire);
  const handleDeleteWire = (path: Path[]) => dispatchDeleteWire(dispatch, path);

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
      <Row>
        <Col xs={24}>
          <label>
            <FormattedMessage id="coilCalculator.inputs.setup" />
            <Select defaultValue={`${coil.setup}`} onChange={onSetupChange}>
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
              defaultValue={coil.innerDiameter}
              value={coil.innerDiameter}
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
              value={coil.legsLength}
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
                  value={coil.resistance}
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
                  value={coil.wraps}
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
          <Button type="primary" icon={<CalculatorOutlined />} size="large" onClick={calculate}>
            <FormattedMessage id="coilCalculator.inputs.calculate" />
          </Button>
          &nbsp;
          <Button
            type="primary"
            icon={<CalculatorOutlined />}
            size="large"
            onClick={() => {
              saveCoil(coil, user);
            }}
          >
            <FormattedMessage id="misc.save" defaultMessage="Save" />
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
        complexWire={coil}
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
    <div>
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
    </div>
  );
};

export default connect(({ coil, user }: ConnectState) => ({
  coil: coil.currentCoil,
  properties: coil.properties,
  baseVoltage: coil.baseVoltage,
  isPro: isProUser(user.currentUser),
  user: user.currentUser,
}))(CoilCalculator);
