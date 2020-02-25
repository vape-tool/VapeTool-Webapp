import React from 'react';
import { Card, Col, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { AWG_TO_MM, dispatchChangeValue, SET_AWG_IN_AWG_TO_MM, SET_MM_IN_AWG_TO_MM } from '@/models/converter';

import styles from './converters.less';

const AwgConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { awg, mm } = converter[AWG_TO_MM];

  const onChangeAwg = dispatchChangeValue(dispatch, SET_AWG_IN_AWG_TO_MM);
  const onChangeMm = dispatchChangeValue(dispatch, SET_MM_IN_AWG_TO_MM);

  return (
    <Card title="Convert AWG to mm">
      <Row type="flex" justify="space-between">
        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            AWG
            <InputNumber
              size="large"
              min={0}
              max={100}
              value={awg}
              onChange={onChangeAwg}
              placeholder="AWG"
              className={styles.input}
            />
          </label>
        </Col>

        <Col xs={4} lg={24} xl={4} style={{ textAlign: 'center' }}>
          <Icon type="swap" className={styles.swapSign} />
        </Col>

        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <label>
            [mm]
            <InputNumber
              size="large"
              min={0}
              max={100000}
              step={0.01}
              value={mm}
              onChange={onChangeMm}
              placeholder="mm"
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
