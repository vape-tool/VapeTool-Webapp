import React from 'react';
import { Button, Card, InputNumber, Select, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { CoilModelState, ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import ComplexWire from '@/components/ComplexWire';

const { Option } = Select;
const { Title } = Typography;


export interface CoilCalculatorProps extends ConnectProps {
  coil: CoilModelState,
  dispatch: Dispatch;
}

let lastEdit: 'wraps' | 'resistance' | undefined;

const CoilCalculator: React.FC<CoilCalculatorProps> = props => {
  const { dispatch, coil } = props;


  const onSetupChange = ({ key, label }: any): void =>
    key && dispatch && dispatch({
      type: 'coil/setSetup',
      payload: Number(key),
    });

  const onInnerDiameterChange = (value: number | undefined): void =>
    value && dispatch && dispatch({
      type: 'coil/setInnerDiameter',
      payload: value,
    });

  const onLegsLengthChange = (value: number | undefined): void =>
    value && dispatch && dispatch({
      type: 'coil/setLegsLength',
      payload: value,
    });

  const onResistanceChange = (value: number | undefined): void => {
    lastEdit = 'resistance';
    return value && dispatch && dispatch({
      type: 'coil/setResistance',
      payload: value,
    })
  };

  const onWrapsChange = (value: number | undefined): void => {
    lastEdit = 'wraps';
    return value && dispatch && dispatch({
      type: 'coil/setWraps',
      payload: value,
    })
  };

  const calculate = (): void => {
    if (lastEdit === 'wraps') {
      dispatch({
        type: 'coil/getResistance',
        payload: coil.currentCoil,
      })
    } else { // default
      dispatch({
        type: 'coil/getWraps',
        payload: coil.currentCoil,
      })
    }
  };

  return (<PageHeaderWrapper>
      <Card>
        <Title level={4}>Setup</Title>

        <Select labelInValue defaultValue={{ key: `${coil.currentCoil.setup}` }} onChange={onSetupChange}>
          <Option value="1">Single Coil (1)</Option>
          <Option value="2">Dual Coil (2)</Option>
          <Option value="3">Triple Coil (3)</Option>
          <Option value="4">Quad Coil (4)</Option>
        </Select>

        <Title level={4}>Type</Title>
        <ComplexWire wiresTree={coil.currentCoil}/>

        <Title level={4}>Inner diameter of coil</Title>
        <InputNumber min={0.0} defaultValue={coil.currentCoil.innerDiameter}
                     onChange={onInnerDiameterChange}/>

        <Title level={4}>Legs length per coil</Title>
        <InputNumber min={0.0} defaultValue={coil.currentCoil.legsLength}
                     onChange={onLegsLengthChange}/>

        <Title level={4}>Resistance</Title>
        <InputNumber min={0.0} defaultValue={coil.currentCoil.resistance}
                     onChange={onResistanceChange}/>

        <Title level={4}>Wraps per coil</Title>
        <InputNumber min={0.0} defaultValue={coil.currentCoil.wraps}
                     onChange={onWrapsChange}/>
        <br/>
        <br/>
        <Button type="primary" onClick={calculate}>Calculate</Button>

      </Card>
    </PageHeaderWrapper>
  )
};

export default connect(({ coil }: ConnectState) => ({
  coil,
}))(CoilCalculator);
