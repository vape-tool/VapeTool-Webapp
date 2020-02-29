import React from 'react';
import { Card, Col, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { dispatchChangeValue, SET_CELSIUS_IN_TEMPERATURE, SET_FAHRENHEIT_IN_TEMPERATURE, TEMPERATURE } from '@/models/converter';

import styles from './converters.less';

const TempConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { celsius, fahrenheit } = converter[TEMPERATURE];

  const onChangeCelsius = dispatchChangeValue(dispatch, SET_CELSIUS_IN_TEMPERATURE);
  const onChangeFahrenheit = dispatchChangeValue(dispatch, SET_FAHRENHEIT_IN_TEMPERATURE);

  return (
    <Card title="Convert Celsius to Fahrenheit">
      <Row type="flex" justify="space-between">
        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            Celsius [°C]
            <InputNumber
              size="large"
              min={-273.15}
              step={0.5}
              value={celsius}
              precision={2}
              onChange={onChangeCelsius}
              placeholder="Celsius"
              className={styles.input}
            />
          </label>
        </Col>

        <Col xs={4} lg={24} xl={4} style={{ textAlign: 'center' }}>
          <Icon type="swap" className={styles.swapSign} />
        </Col>

        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            Fahrenheit [°F]
            <InputNumber
              size="large"
              step={1}
              value={fahrenheit}
              precision={1}
              onChange={onChangeFahrenheit}
              placeholder="Fahrenheit"
              className={styles.input}
            />
          </label>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(TempConverter);
