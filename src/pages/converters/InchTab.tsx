import React from 'react';
import { Col, InputNumber, Row, Typography } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { unitFormatter } from '@/utils/utils';

const InchTab: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;

  const onChangeNominator = (value: number | undefined): void =>
    value &&
    dispatch({
      type: 'converter/setNominator',
      payload: value,
    });
  const onChangeDenominator = (value: number | undefined): void =>
    value &&
    dispatch({
      type: 'converter/setDenominator',
      payload: value,
    });

  return (
    <div>
      <Row type="flex">
        <Col xs={10} md={12}>
          <Typography.Text>Nominator</Typography.Text>
          <InputNumber
            size="large"
            min={1}
            max={10}
            step={1}
            value={converter.nominator}
            formatter={unitFormatter(0)}
            onChange={onChangeNominator}
          />
        </Col>
        <Col xs={10} md={12}>
          <Typography.Text>Denominator</Typography.Text>
          <InputNumber
            size="large"
            min={1}
            max={100}
            step={1}
            formatter={unitFormatter(0)}
            value={converter.denominator}
            onChange={onChangeDenominator}
          />
        </Col>
      </Row>
      <Typography.Text>
        {converter.inchMm ? `${converter.inchMm.toFixed(1)} mm` : 'unknown'}
      </Typography.Text>
    </div>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(InchTab);
