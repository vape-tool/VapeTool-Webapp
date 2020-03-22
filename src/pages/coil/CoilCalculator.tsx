import React, { useState } from 'react';
import { Button, Card, Col, Descriptions, InputNumber, Row, Select, Typography } from 'antd';
import { connect } from 'dva';
import { Coil, Properties } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';
import {
  CALCULATE_FOR_RESISTANCE,
  CALCULATE_FOR_WRAPS,
  COIL,
  SET_INNER_DIAMETER,
  SET_LEGS_LENGTH,
  SET_RESISTANCE,
  SET_SETUP,
  SET_WRAPS,
} from '@/models/coil';
import { CalculatorOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps extends ConnectProps {
  coil: Coil;
  properties?: Properties;
  baseVoltage: number;
}

enum Field {
  SETUP = 'SETUP',
  INNER_DIAMETER = 'INNER_DIAMETER',
  LEGS_LENGTH = 'LEGS_LENGTH',
  RESISTANCE = 'RESISTANCE',
  WRAPS = 'WRAPS',
}

const FIELD_TO_METHOD_MAP = {
  [Field.SETUP]: SET_SETUP,
  [Field.INNER_DIAMETER]: SET_INNER_DIAMETER,
  [Field.LEGS_LENGTH]: SET_LEGS_LENGTH,
  [Field.RESISTANCE]: SET_RESISTANCE,
  [Field.WRAPS]: SET_WRAPS,
};

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil, properties, baseVoltage } = props;

  const [lastEdit, setLastEdit] = useState();

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

  const onSetupChange = ({ key }) => onValueChanged(Field.SETUP)(Number(key));
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

  const descriptionItem = (title: string, property: string, unit: string) => (
    <Descriptions.Item key={property} label={title}>
      {properties ? `${Number(properties[property]).toFixed(2)} ${unit}` : 'Calculation required'}
    </Descriptions.Item>
  );

  // {{descriptionItem('Total width', 'totalWidth', 'mm')}}  //TODO fix it
  // {{descriptionItem('Total height', 'totalHeight', 'mm')}} //TODO fix it
  const coilProperties = (
    <Col xs={24}>
      <Descriptions title="Properties" layout="horizontal" column={1}>
        <Descriptions.Item key="voltage" label="Based on voltage">
          {baseVoltage} V
        </Descriptions.Item>
        {descriptionItem('Current', 'current', 'A')}
        {descriptionItem('Power', 'power', 'W')}
        {descriptionItem('Heat', 'heat', 'mW/cm^2')}
        {descriptionItem('Surface', 'surface', 'cm^2')}
        {descriptionItem('Total length', 'totalLength', 'mm')}
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
            </div>
          </Row>
          <br />
          <br />
          <Col xs={24}>
            <Button type="primary" icon={<CalculatorOutlined />} size="large" onClick={calculate}>
              Calculate
            </Button>
          </Col>
          <br />
          <br />
          {coilProperties}
        </Col>
      </Row>
    </Card>
  );
  const coilSchema = (
    <Card title={<Title level={4}>Type</Title>} style={{ height: '100%' }}>
      <ComplexWire dispatch={dispatch} complexWire={coil} path={[]} />
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

export default connect(({ coil }: ConnectState) => ({
  coil: coil.currentCoil,
  properties: coil.properties,
  baseVoltage: coil.baseVoltage,
}))(CoilCalculator);
