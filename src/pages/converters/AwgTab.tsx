import React from 'react';
import { Col, InputNumber, Row, Typography } from 'antd';
import { connect } from 'dva';
import { ConverterComponentProps } from '@/pages/converters/Converters';
import { ConnectState } from '@/models/connect';
import { unitFormatter } from '@/utils/utils';

const AwgTab: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;

  const onChangeAwg = (value: number | undefined) =>
    value &&
    dispatch({
      type: 'converter/setAwg',
      payload: value,
    });
  const onChangeMm = (value: number | undefined) =>
    value &&
    dispatch({
      type: 'converter/setMm',
      payload: value,
    });

  return (
    <div>
      <Row type="flex">
        <Col xs={10} md={12}>
          <Typography.Text>AWG</Typography.Text>
          <InputNumber
            size="large"
            formatter={unitFormatter(0)}
            min={1}
            max={100000}
            value={converter.awg}
            onChange={onChangeAwg}
          />
        </Col>
        <Col xs={10} md={12}>
          <Typography.Text>mm</Typography.Text>
          <InputNumber
            size="large"
            min={0}
            max={100000}
            step={0.01}
            formatter={unitFormatter(3)}
            value={converter.mm}
            onChange={onChangeMm}
          />
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(AwgTab);
