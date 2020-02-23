import React from 'react';
import { Card, Col, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { unitFormatter, unitParser } from '@/utils/utils';
import { AWG_TO_MM, SET_AWG_IN_AWG_TO_MM, SET_MM_IN_AWG_TO_MM } from '@/models/converter';
import { onChangeValue } from '@/pages/converters/utils';

import styles from './converters.less';

const AwgConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { awg, mm } = converter[AWG_TO_MM];

  const onChangeAwg = onChangeValue(dispatch, SET_AWG_IN_AWG_TO_MM);
  const onChangeMm = onChangeValue(dispatch, SET_MM_IN_AWG_TO_MM);

  return (
    <Card title="Convert AWG to mm">
      <Row type="flex" style={{ padding: '20px 0' }}>
        <Col md={11} style={{ textAlign: 'center' }}>
          <InputNumber
            size="large"
            min={0}
            max={100}
            formatter={unitFormatter(0, 'AWG')}
            parser={unitParser(0, 'AWG')}
            value={awg}
            onChange={onChangeAwg}
            placeholder="AWG"
            className={styles.input}
          />
        </Col>

        <Col md={2} style={{ textAlign: 'center' }}>
          <Icon type="swap" style={{ fontSize: 40 }} />
        </Col>

        <Col md={11} style={{ textAlign: 'center' }}>
          <InputNumber
            size="large"
            min={0}
            max={100000}
            step={0.01}
            formatter={unitFormatter(3, 'mm')}
            parser={unitParser(3, 'mm')}
            value={mm}
            onChange={onChangeMm}
            placeholder="mm"
            className={styles.input}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(AwgConverter);
