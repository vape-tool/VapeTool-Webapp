import React from 'react';
import { Col, InputNumber, Row, Typography } from 'antd';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';


const InchTab: React.FC<ConverterComponentProps> = props => {
  const {
    converter,
    dispatch,
  } = props;

  const onChangeNominator = (value: number | undefined): void =>
    value &&
    dispatch({
      type: 'converter/setNominator',
      payload: value,
    });
  const onChangeDenominator = (value: number | undefined): void =>
    value &&
    dispatch({
      type: 'converter/setDenominator',
      payload: value,
    });

  return (
    <div>
      <Row type="flex">
        <Col xs={10} md={12}>
          <Typography.Text>AWG</Typography.Text>
          <InputNumber size="large" min={1} max={10} step={1} value={converter.nominator} onChange={onChangeNominator}/>
        </Col>
        <Col xs={10} md={12}>
          <Typography.Text>mm</Typography.Text>
          <InputNumber size="large" min={1} max={100} step={1} value={converter.denominator}
                       onChange={onChangeDenominator}/>
        </Col>
      </Row>
      <Typography.Text>{converter.inchMm}</Typography.Text>
    </div>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(InchTab);
