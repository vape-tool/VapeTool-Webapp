import React from 'react';
import AwgConverter from '@/pages/converters/AwgConverter';
import InchConverter from '@/pages/converters/InchConverter';
import TempConverter from '@/pages/converters/TempConverter';
import { Col, Row } from 'antd';


const Converters: React.FC = () => (
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

export default Converters;
