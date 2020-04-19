import React from 'react';
import { Card, Col, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { LineOutlined, PauseOutlined, SwapOutlined } from '@ant-design/icons';
import {
  dispatchChangeValue,
  INCH_TO_MM,
  SET_DENOMINATOR_IN_INCH_TO_MM,
  SET_INCH_IN_INCH_TO_MM,
  SET_MM_IN_INCH_TO_MM,
  SET_NOMINATOR_IN_INCH_TO_MM,
} from '@/models/converter';

import styles from './converters.less';

const InchConverter: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;
  const { nominator, denominator, inch, mm } = converter[INCH_TO_MM];

  const onChangeNominator = dispatchChangeValue(dispatch, SET_NOMINATOR_IN_INCH_TO_MM);
  const onChangeDenominator = dispatchChangeValue(dispatch, SET_DENOMINATOR_IN_INCH_TO_MM);
  const onChangeInch = dispatchChangeValue(dispatch, SET_INCH_IN_INCH_TO_MM);
  const onChangeMm = dispatchChangeValue(dispatch, SET_MM_IN_INCH_TO_MM);

  return (
    <Card
      title={<FormattedMessage id="converters.titles.inchToMm" defaultMessage="Inches to mm" />}
    >
      <Row justify="space-between">
        <Col xs={10} lg={24} xl={10} style={{ textAlign: 'center' }}>
          <div className={styles.fraction}>
            <InputNumber
              size="large"
              type="number"
              min={1}
              max={10}
              step={1}
              precision={0}
              value={nominator}
              onChange={onChangeNominator}
              className={styles.nominator}
            />

            <LineOutlined className={styles.line} />

            <InputNumber
              size="large"
              type="number"
              min={1}
              max={100}
              step={1}
              precision={0}
              value={denominator}
              onChange={onChangeDenominator}
              className={styles.denominator}
            />
          </div>
        </Col>

        <Col xs={4} lg={24} xl={4} style={{ textAlign: 'center' }}>
          <PauseOutlined className={styles.equalSign} />
        </Col>

        <Col xs={10} lg={24} xl={10} className={styles.inchesInput} style={{ textAlign: 'center' }}>
          <label>
            [
            <FormattedMessage id="misc.units.inch" defaultMessage="inch" />
            ]
            <InputNumber
              size="large"
              type="number"
              min={0}
              max={100000}
              step={0.01}
              value={inch}
              precision={4}
              onChange={onChangeInch}
              placeholder={formatMessage({ id: 'misc.units.inch', defaultMessage: 'inch' })}
              className={styles.input}
            />
          </label>
        </Col>

        <Col xs={24} style={{ textAlign: 'center', paddingTop: 40 }}>
          <SwapOutlined style={{ fontSize: 40, transform: 'rotate(90deg)' }} />
        </Col>

        <Col xs={24} style={{ textAlign: 'center', paddingTop: 40 }}>
          <label>
            [
            <FormattedMessage id="misc.units.mm" defaultMessage="mm" />
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
              placeholder={formatMessage({ id: 'misc.units.mm', defaultMessage: 'mm' })}
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
}))(InchConverter);
