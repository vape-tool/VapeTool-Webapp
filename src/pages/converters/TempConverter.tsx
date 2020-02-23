import React from 'react';
import { Card, Col, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { SET_CELSIUS_IN_TEMPERATURE, SET_FAHRENHEIT_IN_TEMPERATURE, TEMPERATURE } from '@/models/converter';
import { onChangeValue } from '@/pages/converters/utils';

import styles from './converters.less';
import { unitFormatter, unitParser } from '@/utils/utils';

const TempConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { celsius, fahrenheit } = converter[TEMPERATURE];

  const onChangeCelsius = onChangeValue(dispatch, SET_CELSIUS_IN_TEMPERATURE);
  const onChangeFahrenheit = onChangeValue(dispatch, SET_FAHRENHEIT_IN_TEMPERATURE);

  return (
    <Card title="Convert Celsius to Fahrenheit">
      <Row type="flex" style={{ padding: '20px 0' }}>
        <Col md={11} style={{ textAlign: 'center' }}>
          <InputNumber
            size="large"
            min={-273.15}
            step={0.5}
            precision={2}
            formatter={unitFormatter(2, '°C')}
            parser={unitParser(2, '°C', true)}
            value={celsius}
            onChange={onChangeCelsius}
            placeholder="Celsius"
            className={styles.input}
          />
        </Col>

        <Col md={2} style={{ textAlign: 'center' }}>
          <Icon type="swap" style={{ fontSize: 40 }} />
        </Col>

        <Col md={11} style={{ textAlign: 'center' }}>
          <InputNumber
            size="large"
            step={1}
            precision={1}
            formatter={unitFormatter(1, '°F')}
            parser={unitParser(1, '°F')}
            value={fahrenheit}
            onChange={onChangeFahrenheit}
            placeholder="Fahrenheit"
            className={styles.input}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(TempConverter);
