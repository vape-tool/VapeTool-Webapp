import React from 'react';
import { Button, Card, Col, Descriptions, InputNumber, Row, Select, Typography } from 'antd';
import { connect } from 'dva';
import { Coil, Properties } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';
import { unitFormatter, unitParser } from '@/utils/utils';
import {
  SET_INNER_DIAMETER,
  SET_SETUP,
  COIL,
  SET_LEGS_LENGTH,
  SET_RESISTANCE,
  SET_WRAPS,
  CALCULATE_FOR_RESISTANCE,
  CALCULATE_FOR_WRAPS,
} from '@/models/coil';
import { CalculatorOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps extends ConnectProps {
  coil: Coil;
  properties?: Properties;
  baseVoltage: number;
}

let lastEdit: 'wraps' | 'resistance' | undefined;

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil, properties, baseVoltage } = props;

  const onSetupChange = ({ key }: any) =>
    key &&
    dispatch({
      type: `${COIL}/${SET_SETUP}`,
      payload: Number(key),
    });

  const onInnerDiameterChange = (value: number | undefined) =>
    value &&
    dispatch({
      type: `${COIL}/${SET_INNER_DIAMETER}`,
      payload: value,
    });

  const onLegsLengthChange = (value: number | undefined) =>
    value &&
    dispatch({
      type: `${COIL}/${SET_LEGS_LENGTH}`,
      payload: value,
    });

  const onResistanceChange = (value: number | undefined) => {
    lastEdit = 'resistance';
    return (
      value &&
      dispatch({
        type: `${COIL}/${SET_RESISTANCE}`,
        payload: value,
      })
    );
  };

  const onWrapsChange = (value: number | undefined) => {
    lastEdit = 'wraps';
    return (
      value &&
      dispatch({
        type: `${COIL}/${SET_WRAPS}`,
        payload: value,
      })
    );
  };

  const calculate = (): void => {
    if (dispatch) {
      if (lastEdit === 'wraps') {
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
          <Title level={4}>Setup</Title>
        </Col>
        <Col xs={24}>
          <Select defaultValue={`${coil.setup}`} onChange={onSetupChange}>
            <Option value="1">Single Coil (1)</Option>
            <Option value="2">Dual Coil (2)</Option>
            <Option value="3">Triple Coil (3)</Option>
            <Option value="4">Quad Coil (4)</Option>
          </Select>
        </Col>
        <Col xs={24}>
          <Title level={4}>Inner diameter of coil</Title>
        </Col>
        <Col xs={24}>
          <InputNumber
            min={0.0}
            step={0.1}
            formatter={unitFormatter(1, 'mm')}
            parser={unitParser(1, 'mm')}
            defaultValue={coil.innerDiameter}
            value={coil.innerDiameter}
            onChange={onInnerDiameterChange}
          />
        </Col>
        <Col xs={24}>
          <Title level={4}>Legs length per coil</Title>
        </Col>
        <Col xs={24}>
          <InputNumber
            min={0.0}
            step={1}
            formatter={unitFormatter(0, 'mm')}
            parser={unitParser(0, 'mm')}
            value={coil.legsLength}
            onChange={onLegsLengthChange}
          />
        </Col>
        <Col xs={24}>
          <Row>
            <div style={{ marginRight: 32 }}>
              <Title level={4}>Resistance</Title>
              <InputNumber
                min={0.0}
                step={0.05}
                formatter={unitFormatter(3, 'Ω')}
                parser={unitParser(3, 'Ω')}
                value={coil.resistance}
                onChange={onResistanceChange}
              />
            </div>
            <div>
              <Title level={4}>Wraps per coil</Title>
              <InputNumber min={0} step={1} value={coil.wraps} onChange={onWrapsChange} />
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
