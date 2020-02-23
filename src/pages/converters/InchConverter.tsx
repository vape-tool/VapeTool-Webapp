import React from 'react';
import { Card, Col, Icon, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { unitFormatter, unitParser } from '@/utils/utils';
import { INCH_TO_MM, SET_DENOMINATOR_IN_INCH_TO_MM, SET_INCH_IN_INCH_TO_MM, SET_MM_IN_INCH_TO_MM, SET_NOMINATOR_IN_INCH_TO_MM } from '@/models/converter';
import { onChangeValue } from '@/pages/converters/utils';

import styles from './converters.less';

const InchConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { nominator, denominator, inch, mm } = converter[INCH_TO_MM];

  const onChangeNominator = onChangeValue(dispatch, SET_NOMINATOR_IN_INCH_TO_MM);
  const onChangeDenominator = onChangeValue(dispatch, SET_DENOMINATOR_IN_INCH_TO_MM);
  const onChangeInch = onChangeValue(dispatch, SET_INCH_IN_INCH_TO_MM);
  const onChangeMm = onChangeValue(dispatch, SET_MM_IN_INCH_TO_MM);

  return (
    <Card title="Convert inches to mm">
      <Row type="flex" style={{ padding: '20px 0' }}>
        <Col md={11} style={{ textAlign: 'center' }}>
          <div className={styles.fraction}>
            <InputNumber
              size="large"
              min={1}
              max={10}
              step={1}
              precision={0}
              value={nominator}
              formatter={unitFormatter(0)}
              onChange={onChangeNominator}
              className={styles.nominator}
            />

            <Icon type="line" className={styles.line} />

            <InputNumber
              size="large"
              min={1}
              max={100}
              step={1}
              precision={0}
              formatter={unitFormatter(0)}
              value={denominator}
              onChange={onChangeDenominator}
              className={styles.denominator}
            />
          </div>
        </Col>

        <Col md={2} style={{ textAlign: 'center', paddingTop: 40 }}>
          <Icon type="pause" style={{ fontSize: 40, transform: 'rotate(90deg)' }} />
        </Col>

        <Col md={11} style={{ textAlign: 'center', paddingTop: 40 }}>
          <InputNumber
            size="large"
            min={0}
            max={100000}
            step={0.01}
            formatter={unitFormatter(3, 'inch')}
            parser={unitParser(3, 'inch')}
            value={inch}
            onChange={onChangeInch}
            placeholder="inches"
            className={styles.input}
          />
        </Col>

        <Col xs={24} style={{ textAlign: 'center', paddingTop: 40 }}>
          <Icon type="swap" style={{ fontSize: 40, transform: 'rotate(90deg)' }} />
        </Col>

        <Col xs={24} style={{ textAlign: 'center', paddingTop: 40 }}>
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
}))(InchConverter);
