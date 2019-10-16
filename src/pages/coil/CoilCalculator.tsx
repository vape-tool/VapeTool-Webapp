import React from 'react';
import { Button, Card, Col, InputNumber, Row, Select, Typography } from 'antd';
import { connect } from 'dva';
import { Coil } from '@vapetool/types';
import { Dispatch } from 'redux';
import { ConnectProps, ConnectState } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';
import { unitFormatter, unitParser } from '@/utils/utils';

const { Option } = Select;
const { Title } = Typography;

export interface CoilCalculatorProps extends ConnectProps {
  currentCoil: Coil;
  dispatch: Dispatch;
}

let lastEdit: 'wraps' | 'resistance' | undefined;

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, currentCoil } = props;

  const onSetupChange = ({ key, label }: any) =>
    key &&
    dispatch &&
    dispatch({
      type: 'coil/setSetup',
      payload: Number(key),
    });

  const onInnerDiameterChange = (value: number | undefined) =>
    value &&
    dispatch &&
    dispatch({
      type: 'coil/setInnerDiameter',
      payload: value,
    });

  const onLegsLengthChange = (value: number | undefined) =>
    value &&
    dispatch &&
    dispatch({
      type: 'coil/setLegsLength',
      payload: value,
    });

  const onResistanceChange = (value: number | undefined) => {
    lastEdit = 'resistance';
    return (
      value &&
      dispatch &&
      dispatch({
        type: 'coil/setResistance',
        payload: value,
      })
    );
  };

  const onWrapsChange = (value: number | undefined) => {
    lastEdit = 'wraps';
    return (
      value &&
      dispatch &&
      dispatch({
        type: 'coil/setWraps',
        payload: value,
      })
    );
  };

  const calculate = (): void => {
    if (lastEdit === 'wraps') {
      dispatch({
        type: 'coil/calculateForResistance',
        payload: currentCoil,
      });
    } else {
      // default
      dispatch({
        type: 'coil/calculateForWraps',
        payload: currentCoil,
      });
    }
  };

  return (
    <div>
      <Row type="flex" style={{ alignItems: 'stretch' }} justify="center">
        <Col xs={{ span: 24, order: 2 }} xl={{ span: 8, order: 1 }}>
          <Card style={{ height: '100%' }}>
            <Row type="flex">
              <Col xs={24}>
                <Title level={4}>Setup</Title>
              </Col>
              <Col xs={24}>
                <Select
                  labelInValue
                  defaultValue={{ key: `${currentCoil.setup}` }}
                  onChange={onSetupChange}
                >
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
                  parser={unitParser('mm')}
                  defaultValue={currentCoil.innerDiameter}
                  value={currentCoil.innerDiameter}
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
                  parser={unitParser('mm')}
                  value={currentCoil.legsLength}
                  onChange={onLegsLengthChange}
                />
              </Col>
              <Col xs={24}>
                <Row type="flex">
                  <div style={{ marginRight: 32 }}>
                    <Title level={4}>Resistance</Title>
                    <InputNumber
                      min={0.0}
                      step={0.05}
                      formatter={unitFormatter(3, 'Ω')}
                      parser={unitParser('Ω')}
                      value={currentCoil.resistance}
                      onChange={onResistanceChange}
                    />
                  </div>
                  <div>
                    <Title level={4}>Wraps per coil</Title>
                    <InputNumber
                      min={0}
                      step={1}
                      value={currentCoil.wraps}
                      onChange={onWrapsChange}
                    />
                  </div>
                </Row>
                <br />
                <br />
                <Col xs={24}>
                  <Button type="primary" icon="calculator" size="large" onClick={calculate}>
                    Calculate
                  </Button>
                </Col>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={{ span: 24, order: 1 }} xl={{ span: 16, order: 2 }}>
          <Card title={<Title level={4}>Type</Title>} style={{ height: '100%' }}>
            <ComplexWire dispatch={dispatch} complexWire={currentCoil} path={[]} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ coil }: ConnectState) => ({
  currentCoil: coil.currentCoil,
}))(CoilCalculator);
