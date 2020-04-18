import React from 'react';
import { Card, Col, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { SwapOutlined } from '@ant-design/icons';
import {
  AWG_TO_MM,
  dispatchChangeValue,
  SET_AWG_IN_AWG_TO_MM,
  SET_MM_IN_AWG_TO_MM,
} from '@/models/converter';

import styles from './converters.less';

const AwgConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { awg, mm } = converter[AWG_TO_MM];

  const onChangeAwg = dispatchChangeValue(dispatch, SET_AWG_IN_AWG_TO_MM);
  const onChangeMm = dispatchChangeValue(dispatch, SET_MM_IN_AWG_TO_MM);

  return (
    <Card title={<FormattedMessage id="converters.titles.awgToMm" />}>
      <Row justify="space-between">
        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            <FormattedMessage id="misc.units.awg" />
            <InputNumber
              size="large"
              type="number"
              min={0}
              max={100}
              value={awg}
              precision={0}
              onChange={onChangeAwg}
              placeholder={formatMessage({ id: 'misc.units.awg' })}
              className={styles.input}
            />
          </label>
        </Col>

        <Col xs={4} lg={24} xl={4} style={{ textAlign: 'center' }}>
          <SwapOutlined className={styles.swapSign} />
        </Col>

        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            [
            <FormattedMessage id="misc.units.mm" />
            ]
            <InputNumber
              size="large"
              type="number"
              min={0}
              max={100000}
              step={0.01}
              value={mm}
              precision={3}
              onChange={onChangeMm}
              placeholder={formatMessage({ id: 'misc.units.mm' })}
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
}))(AwgConverter);
