import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Row, Table, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { UpOutlined } from '@ant-design/icons';
import { MixableType, Mixable } from '@vapetool/types';
import InputElements from './inputElements';
import SelectType from './SelectType';
import { calculate } from '@/services/mixer';

// TODO check if not needed adjust to new Form API
const Mixer: React.FC = () => {
  // const mixDataPattern = {
  //   type: MixableType.BASE,
  //   amount: null,
  //   strength: null,
  //   ratio: 50,
  //   thinner: null,
  // };

  const mixDataPattern: Partial<Mixable> = {
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Percentage [%]',
      dataIndex: 'percentage',
      key: 'percentage',
    },
    {
      title: 'Amount [ml]',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Drops',
      dataIndex: 'drops',
      key: 'drops',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Weight [g]',
      dataIndex: 'weight',
      key: 'weight',
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Base',
      percentage: 32,
      amount: 10,
      drops: 400,
      weight: 10,
    },
    {
      key: '2',
      name: 'Premix',
      percentage: 32,
      amount: 10,
      drops: 400,
      weight: 10,
    },
    {
      key: '3',
      name: 'Total',
      percentage: 32,
      amount: 10,
      drops: 400,
      weight: 10,
    },
  ];

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

          <Card>
            <Row
              style={{
                textAlign: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                fontSize: 24,
              }}
            >
              <Col style={{ margin: 'auto' }}>
                <Row>
                  <Typography style={{ fontWeight: 'bold', fontSize: 24 }}>Ratio:&nbsp;</Typography>
                  <Typography>55VG/45PG</Typography>
                </Row>
              </Col>
              <Col style={{ margin: 'auto' }}>
                <Row>
                  <Typography style={{ fontWeight: 'bold', fontSize: 24 }}>
                    Strength:&nbsp;
                  </Typography>
                  <Typography>18.00 mg/ml</Typography>
                </Row>
              </Col>
            </Row>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>

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

export default Mixer;