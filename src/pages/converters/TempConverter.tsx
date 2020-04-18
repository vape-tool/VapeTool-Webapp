import React from 'react';
import { Card, Col, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { SwapOutlined } from '@ant-design/icons';
import {
  dispatchChangeValue,
  SET_CELSIUS_IN_TEMPERATURE,
  SET_FAHRENHEIT_IN_TEMPERATURE,
  TEMPERATURE,
} from '@/models/converter';

import styles from './converters.less';

const TempConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { celsius, fahrenheit } = converter[TEMPERATURE];

  const onChangeCelsius = dispatchChangeValue(dispatch, SET_CELSIUS_IN_TEMPERATURE);
  const onChangeFahrenheit = dispatchChangeValue(dispatch, SET_FAHRENHEIT_IN_TEMPERATURE);

  return (
    <Card title={<FormattedMessage id="converters.titles.temp" />}>
      <Row justify="space-between">
        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            <FormattedMessage id="misc.units.long.celsius" />
            <InputNumber
              size="large"
              type="number"
              min={-273.15}
              step={0.5}
              value={celsius}
              precision={2}
              onChange={onChangeCelsius}
              placeholder={formatMessage({ id: 'misc.units.short.celsius' })}
              className={styles.input}
            />
          </label>
        </Col>

        <Col xs={4} lg={24} xl={4} style={{ textAlign: 'center' }}>
          <SwapOutlined className={styles.swapSign} />
        </Col>

        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            <FormattedMessage id="misc.units.long.fahrenheit" />
            <InputNumber
              size="large"
              type="number"
              step={1}
              value={fahrenheit}
              precision={1}
              onChange={onChangeFahrenheit}
              placeholder={formatMessage({ id: 'misc.units.short.fahrenheit' })}
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
