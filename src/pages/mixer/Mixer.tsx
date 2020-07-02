import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Row, Table, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { FormattedMessage } from '@umijs/preset-react';

import { UpOutlined } from '@ant-design/icons';
import { MixableType, Mixable, MixableResult } from '@vapetool/types';
import InputElements from './inputElements';
import SelectType from './SelectType';
import { calculate } from '@/services/mixer';
import { columns } from './tableData';
import { capitalize } from '@/utils/utils';

const Mixer: React.FC = () => {
  const [form] = Form.useForm();

  const mixDataPattern: Partial<Mixable> = {
    amount: undefined,
    strength: undefined,
    ratio: 50,
    thinner: undefined,
    flavorsPercentage: undefined,
  };

  const [mixable1, setMixable1] = useState({
    ...mixDataPattern,
    type: MixableType.PREMIX,
  });

  const [mixable2, setMixable2] = useState({
    ...mixDataPattern,
    type: MixableType.BASE,
  });

  const [data, setData] = useState<Omit<Omit<MixableResult, 'type'>, 'price'>[] | undefined>(
    undefined,
  );

  const [strength, setStrength] = useState<number | undefined>(undefined);

  const [ratio, setRatio] = useState<number | undefined>(undefined);

  const handleClear = () => {
    setMixable1({
      ...mixDataPattern,
      type: mixable1.type,
    });
    setMixable2({
      ...mixDataPattern,
      type: mixable2.type,
    });
  };

  const handleCalculate = async () => {
    const result = await calculate(
      {
        ...(mixable1 as Mixable),
        thinner: mixable1.thinner || 0,
        strength: mixable1.strength || 0,
      },
      {
        ...(mixable2 as Mixable),
        thinner: mixable2.thinner || 0,
        strength: mixable2.strength || 0,
      },
    );
    setRatio(result.ratio);
    setStrength(result.strength);
    console.log(result);
    const newData: Omit<Omit<MixableResult, 'type'>, 'price'>[] = result.results.map(
      (mixableResult: MixableResult, index: number) => ({
        ...mixableResult,
        key: index,
        name: capitalize(MixableType[mixableResult.type]),
      }),
    );
    const total = {
      name: 'Total',
      percentage: 100,
      amount: newData.reduce((current, _result) => current + _result.amount, 0),
      drops: newData.reduce((current, _result) => current + _result.drops, 0),
      weight: newData.reduce((current, _result) => current + _result.weight, 0),
    };
    newData.push(total);
    setData(newData);
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
  return (
    <PageHeaderWrapper>
      <Card>
        <Row justify="center" gutter={32}>
          <Col xs={24} sm={20} md={20}>
            <Form
              form={form}
              name="mixer_form"
              onFinish={handleCalculate}
              onFinishFailed={() => console.log('erro')}
              {...formItemLayout}
            >
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
                    <InputElements mixData={mixable1} onValueChange={setMixable1} side="left" />
                  </Card>
                </Col>

                <Col xs={12}>
                  <SelectType mixable={mixable2} onChange={setMixable2} />
                  <Card>
                    <InputElements mixData={mixable2} onValueChange={setMixable2} side="right" />
                  </Card>
                </Col>
              </Row>

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
              {!!ratio && !!strength && data && (
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
                        <Typography>
                          {100 - Math.round(ratio)}VG/
                          {Math.round(ratio)}PG
                        </Typography>
                      </Row>
                    </Col>
                    <Col style={{ margin: 'auto' }}>
                      <Row>
                        <Typography style={{ fontWeight: 'bold', fontSize: 24 }}>
                          Strength:&nbsp;
                        </Typography>
                        <Typography>{Math.round(strength * 100) / 100}&nbsp;mg/ml</Typography>
                      </Row>
                    </Col>
                  </Row>
                  <Table columns={columns} dataSource={data} pagination={false} />
                </Card>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Mixer;
