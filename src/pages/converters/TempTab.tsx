import React from 'react';
import { Col, InputNumber, Row, Typography } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';

const TempTab: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;

  const onChangeCelsius = (value: number | undefined) =>
    value &&
    dispatch({
      type: 'converter/setCelsius',
      payload: value,
    });
  const onChangeFahrenheit = (value: number | undefined) =>
    value &&
    dispatch({
      type: 'converter/setFahrenheit',
      payload: value,
    });

  return (
    <div>
      <Row type="flex">
        <Col xs={10} md={12}>
          <Typography.Text>Celsius</Typography.Text>
          <InputNumber
            size="large"
            min={-273.15}
            step={1}
            precision={1}
            value={converter.celsius}
            onChange={onChangeCelsius}
          />
        </Col>
        <Col xs={10} md={12}>
          <Typography.Text>Fahrenheit</Typography.Text>
          <InputNumber
            size="large"
            step={1}
            precision={1}
            value={converter.fahrenheit}
            onChange={onChangeFahrenheit}
          />
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(TempTab);
