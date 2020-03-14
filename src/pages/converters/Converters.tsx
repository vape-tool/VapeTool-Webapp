import React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { ConverterModelState } from '@/models/converter';
import AwgConverter from '@/pages/converters/AwgConverter';
import InchConverter from '@/pages/converters/InchConverter';
import TempConverter from '@/pages/converters/TempConverter';
import { Col, Row } from 'antd';

export interface ConverterComponentProps {
  converter: ConverterModelState;
  dispatch: Dispatch;
}

const Converters: React.FC<ConverterComponentProps> = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} md={24} lg={8}>
      <AwgConverter />
    </Col>

    <Col xs={24} md={24} lg={8}>
      <InchConverter />
    </Col>

    <Col xs={24} md={24} lg={8}>
      <TempConverter />
    </Col>
  </Row>
);

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(Converters);
