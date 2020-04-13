import React, { useState } from 'react';
import { Button, Card, Col, Descriptions, InputNumber, Row, Select, Tag, Typography } from 'antd';
import { connect } from 'dva';
import { Coil, Properties, Wire } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';
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
  SET_WRAPS,
  SET_VOLTAGE,
} from '@/models/coil';
import { CalculatorOutlined, LockFilled, UnlockOutlined } from '@ant-design/icons';
import { isProUser } from '@/pages/login/utils/utils';
import styles from './styles.less';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps extends ConnectProps {
  coil: Coil;
  properties?: Properties;
  baseVoltage: number;
  isPro: boolean;
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

const proOnlyTag = <Tag color="blue">Pro only</Tag>;

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil, properties, baseVoltage, isPro } = props;

  const [lastEdit, setLastEdit] = useState('resistance');

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
  const onBaseVoltageChange = onValueChanged(Field.VOLTAGE);

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

  const toggleLock = () => {
    setLastEdit(lastEdit === 'resistance' ? 'wraps' : 'resistance');
  };

  const handleWireTypeChange = (type: string, path: Path[]): void =>
    dispatchSetCoilType(dispatch, type, path);
  const handleAddWire = (path: Path[], wire: Wire) => dispatchAddWire(dispatch, path, wire);
  const handleSetWire = (path: Path[], wire: Wire) => dispatchSetWire(dispatch, path, wire);
  const handleDeleteWire = (path: Path[]) => dispatchDeleteWire(dispatch, path);
  const descriptionItem = (title: string, property: string, unit: string, proOnly?: boolean) => {
    const propertyValue =
      properties && properties[property] !== undefined
        ? `${Number(properties[property]).toFixed(2)} ${unit}`
        : 'Calculation required';

    return (
      <Descriptions.Item key={property} label={title}>
        {proOnly && !isPro ? proOnlyTag : propertyValue}
      </Descriptions.Item>
    );
  };

  // {{descriptionItem('Total width', 'totalWidth', 'mm')}}  //TODO fix it
  // {{descriptionItem('Total height', 'totalHeight', 'mm')}} //TODO fix it
  const coilProperties = (
    <Col xs={24}>
      <Descriptions title="Properties" layout="horizontal" column={1}>
        {descriptionItem('Current', 'current', 'A')}
        {descriptionItem('Power', 'power', 'W')}
        {descriptionItem('Heat', 'heat', 'mW/cm²', true)}
        {descriptionItem('Surface', 'surface', 'cm²', true)}
        {descriptionItem('Total length', 'totalLength', 'mm', true)}
      </Descriptions>
    </Col>
  );
  const coilSetup = (
    <Card style={{ height: '100%' }}>
      <Row>
        <Col xs={24}>
          <label>
            Setup
            <Select defaultValue={`${coil.setup}`} onChange={onSetupChange}>
              <Option value="1">Single Coil (1)</Option>
              <Option value="2">Dual Coil (2)</Option>
              <Option value="3">Triple Coil (3)</Option>
              <Option value="4">Quad Coil (4)</Option>
            </Select>
          </label>
        </Col>

        <Col xs={24}>
          <label>
            Inner diameter of coil [mm]
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
            Legs length per coil [mm]
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
                Resistance [Ω]
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
                Wraps per coil
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
        <Col xs={24}>
          <label>
            Base voltage [V] (default: 3.7V)
            <InputNumber
              min={0.0}
              step={0.1}
              precision={1}
              defaultValue={baseVoltage}
              value={baseVoltage}
              onChange={onBaseVoltageChange}
            />
          </label>
        </Col>

        <Col xs={24} style={{ marginTop: 20 }}>
          <Button type="primary" icon={<CalculatorOutlined />} size="large" onClick={calculate}>
            Calculate
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
      <Row style={{ alignItems: 'stretch' }} justify="center">
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
}))(CoilCalculator);
