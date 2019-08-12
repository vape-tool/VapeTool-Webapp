import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';
import { FormComponentProps } from 'antd/es/form';
// @ts-ignore
import Image from 'react-image-webp';

const guideImage = require('@/assets/ohm_law.webp');

export interface OhmLawProps extends ConnectProps, FormComponentProps {
  ohm: LiquidModelState;
  dispatch: Dispatch;
}

class OhmLaw extends Component<OhmLawProps> {
  onChange = (what: 'Voltage' | 'Resistance' | 'Current' | 'Power', value: number | undefined) =>
    value &&
    this.props.dispatch({
      type: `ohm/set${what}`,
      payload: value,
    });

  handleClear = () =>
    this.props.dispatch({
      type: 'ohm/clear',
    });

  render() {
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper>
        <Card>
          <Row type="flex" justify="center" gutter={32}>
            <Col xs={20} sm={18} md={12}>
              <Form {...formItemLayout}>
                <Form.Item label="Voltage">
                  {getFieldDecorator('voltage', {})(
                    <InputNumber
                      size="large"
                      step={0.1}
                      min={0.01}
                      style={{ width: '100%', maxWidth: 200 }}
                      onChange={value => this.onChange('Voltage', value)}
                      placeholder="Volts [V]"
                    />,
                  )}
                </Form.Item>
                <Form.Item label="Resistance">
                  {getFieldDecorator('resistance', {})(
                    <InputNumber
                      size="large"
                      step={0.1}
                      min={0.01}
                      style={{ width: '100%', maxWidth: 200 }}
                      onChange={value => this.onChange('Resistance', value)}
                      placeholder="Ohms [Ω]"
                    />,
                  )}
                </Form.Item>
                <Form.Item label="Current">
                  {getFieldDecorator('current', {})(
                    <InputNumber
                      size="large"
                      step={0.1}
                      min={0.01}
                      style={{ width: '100%', maxWidth: 200 }}
                      onChange={value => this.onChange('Current', value)}
                      placeholder="Amps [A]"
                    />,
                  )}
                </Form.Item>
                <Form.Item label="Power">
                  {getFieldDecorator('power', {})(
                    <InputNumber
                      size="large"
                      step={0.1}
                      min={0.01}
                      style={{ width: '100%', maxWidth: 200 }}
                      onChange={value => this.onChange('Power', value)}
                      placeholder="Wats [W]"
                    />,
                  )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Calculate
                  </Button>
                  <Button type="default" style={{ marginLeft: 8 }} onClick={this.handleClear}>
                    Clear
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={18} sm={16} md={10} lg={8}>
              <Image webp={guideImage} style={{ width: '100%' }} />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const OhmLawForm = Form.create({ name: 'ohm_law' })(OhmLaw);

export default connect(({ ohm }: ConnectState) => ({
  ohm,
}))(OhmLawForm);
