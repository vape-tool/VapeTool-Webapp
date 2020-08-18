import React from 'react';
import AwgConverter from '@/pages/converters/AwgConverter';
import InchConverter from '@/pages/converters/InchConverter';
import TempConverter from '@/pages/converters/TempConverter';
import { Col, Row } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Banner from '@/components/Banner';

const Converters: React.FC = () => (
  <PageContainer>
    <Row justify="center" gutter={32}>
      <div style={{ marginBottom: '2%' }}>
        <Banner providerName="converters_ad_provider" />
      </div>
      <Col xs={24} sm={20} md={22}>
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
      </Col>
    </Row>
  </PageContainer>
);

export default Converters;
