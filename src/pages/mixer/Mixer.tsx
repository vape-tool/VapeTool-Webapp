import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Row, Table, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { UpOutlined } from '@ant-design/icons';
import { MixableType, Mixable, MixResult } from '@vapetool/types';
import InputElements from './inputElements';
import SelectType from './SelectType';
import { calculate } from '@/services/mixer';
import { columns } from './tableData';

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
    flavorPercentage: undefined,
  };

  const mixResultPattern: Partial<MixResult> = {
    amount: 0,
    ratio: 0,
    strength: 0,
  };

  const [mixable1, setMixable1] = useState(mixDataPattern);

  const [mixable2, setMixable2] = useState(mixDataPattern);

  const [results, setResults] = useState({
    ...mixResultPattern,
    results: [mixResultPattern, mixResultPattern, mixResultPattern],
  });

  const [resultsVisible, setResultsVisible] = useState(false);

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
    await calculate(mixable1, mixable2).then(_results => {
      setResultsVisible(true);
      setResults(_results);
      console.log(_results);
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };
  const data = [
    {
      key: '1',
      name: MixableType[mixable1.type],
      percentage: Math.round(results.results[0].percentage * 100) / 100,
      amount: results.results[0].ml,
      drops: results.results[0].drips,
      weight: results.results[0].weight,
    },
    {
      key: '2',
      name: MixableType[mixable2.type],
      percentage: Math.round(results.results[1].percentage * 100) / 100,
      amount: results.results[1].ml,
      drops: results.results[1].drips,
      weight: results.results[1].weight,
    },
    {
      key: '3',
      name: 'Total',
      percentage: 100,
      amount: results.results[1].ml + results.results[2].ml,
      drops: results.results[1].drips + results.results[2].drips,
      weight: results.results[1].weight + results.results[2].weight,
    },
  ];
  return (
    <PageHeaderWrapper>
      <Card>
        <Row justify="center" gutter={32}>
          <Col xs={24} sm={20} md={20}>
            <Form onSubmitCapture={handleCalculate} {...formItemLayout}>
              <Col lg={24} style={{ textAlign: 'center' }}>
                <UpOutlined style={{ fontSize: 60 }} />
              </Col>
              <Row
                style={{
                  textAlign: 'right',
                }}
              >
                <Col xs={12}>
                  <SelectType mixable={mixable1} onChange={setMixable1} />
                  <Card>
                    <InputElements mixData={mixable1} onValueChange={setMixable1} />
                  </Card>
                </Col>

                <Col xs={12}>
                  <SelectType mixable={mixable2} onChange={setMixable2} />
                  <Card>
                    <InputElements mixData={mixable2} onValueChange={setMixable2} />
                  </Card>
                </Col>
              </Row>

              {resultsVisible && (
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
                        <Typography style={{ fontWeight: 'bold', fontSize: 24 }}>
                          Ratio:&nbsp;
                        </Typography>
                        <Typography>55VG/45PG</Typography>
                      </Row>
                    </Col>
                    <Col style={{ margin: 'auto' }}>
                      <Row>
                        <Typography style={{ fontWeight: 'bold', fontSize: 24 }}>
                          Strength:&nbsp;
                        </Typography>
                        <Typography>{results.strength}mg/ml</Typography>
                      </Row>
                    </Col>
                  </Row>
                  <Table columns={columns} dataSource={data} pagination={false} />
                </Card>
              )}

              <Col>
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
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Mixer;
