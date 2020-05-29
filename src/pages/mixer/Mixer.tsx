import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { UpOutlined } from '@ant-design/icons';
import InputElements from './inputElements';
import SelectType from './SelectType';

export interface OhmLawProps {
  ohm: OhmModelState;
  dispatch: Dispatch;
}

// TODO check if not needed adjust to new Form API
const OhmLaw: React.FC<OhmLawProps> = () => {
  const mixDataPattern = {
    ml: undefined,
    mg_ml: undefined,
    vgRatio: 50,
    thinner: undefined,
  };

  const [mixData1, setMixData1] = useState(mixDataPattern);

  const [mixData2, setMixData2] = useState(mixDataPattern);

  const handleClear = () => {
    setMixData1({
      ...mixDataPattern,
    });
  };

  //   const [result, setResult] = useState({
  //     totalMl: 0,
  //     pgRatio: 50,
  //     strength: 0,
  //   });

  const handleCalculate = async (e: any) => {
    e.preventDefault();
    alert('Calculated');
    // fetch('url')
    //   .then(response => response.json())
    //   .then(responseJson => setMixData1(responseJson));
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <Form onSubmitCapture={handleCalculate}>
          <Col lg={24} style={{ textAlign: 'center' }}>
            <UpOutlined style={{ fontSize: 60 }} />
          </Col>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <SelectType />
              <Card>
                <InputElements mixData={mixData1} onValueChange={setMixData1} />
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} lg={12}>
              <SelectType />
              <Card>
                <InputElements mixData={mixData2} onValueChange={setMixData2} />
              </Card>
            </Col>
          </Row>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item style={{ marginTop: 20, display: 'flex', marginLeft: 'auto' }}>
              <ButtonGroup>
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id="misc.actions.calculate" defaultMessage="Calculate" />
                </Button>

                <Button type="default" onClick={handleClear}>
                  <FormattedMessage id="misc.actions.clear" defaultMessage="Reset" />
                </Button>
              </ButtonGroup>
            </Form.Item>
          </Col>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ ohm }: ConnectState) => ({
  ohm,
}))(OhmLaw);
