import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { UpOutlined } from '@ant-design/icons';
import { MixableType, Mixable } from '@vapetool/types';
import InputElements from './inputElements';
import SelectType from './SelectType';
import { calculate } from '@/services/mixer';

export interface OhmLawProps {
  ohm: OhmModelState;
  dispatch: Dispatch;
}

// TODO check if not needed adjust to new Form API
const OhmLaw: React.FC<OhmLawProps> = () => {
  // const mixDataPattern = {
  //   type: MixableType.BASE,
  //   amount: null,
  //   strength: null,
  //   ratio: 50,
  //   thinner: null,
  // };

  const mixDataPattern: Mixable = {
    type: MixableType.BASE,
    amount: undefined,
    strength: undefined,
    ratio: 50,
    thinner: undefined,
  };
  const [mixable1, setMixable1] = useState(mixDataPattern);

  const [mixable2, setMixable2] = useState(mixDataPattern);

  const handleClear = () => {
    setMixable1({
      ...mixDataPattern,
    });
    setMixable2({
      ...mixDataPattern,
    });
  };

  const handleCalculate = async (e: any) => {
    e.preventDefault();
    console.log(await calculate(mixable1, mixable2));
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
              <SelectType mixable={mixable1} onChange={setMixable1} />
              <Card>
                <InputElements mixData={mixable1} onValueChange={setMixable1} />
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} lg={12}>
              <SelectType mixable={mixable2} onChange={setMixable2} />
              <Card>
                <InputElements mixData={mixable2} onValueChange={setMixable2} />
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
