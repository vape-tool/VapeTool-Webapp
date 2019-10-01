import React from 'react';
import { Col, InputNumber, Row, Typography } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { unitFormatter, unitParser } from '@/utils/utils';

const TempTab: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;

  const onChangeCelsius = (value: number | undefined): void =>
    value &&
    dispatch({
      type: 'converter/setCelsius',
      payload: value,
    });
  const onChangeFahrenheit = (value: number | undefined): void =>
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
            formatter={unitFormatter(2, '°C')}
            parser={unitParser('°C')}
            value={converter.celsius}
            onChange={onChangeCelsius}
          />
        </Col>
        <Col xs={10} md={12}>
          <Typography.Text>Fahrenheit</Typography.Text>
          <InputNumber
            size="large"
            step={1}
            formatter={unitFormatter(2, '°F')}
            parser={unitParser('°F')}
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
