import { Form, Input, InputNumber, Modal } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Flavor } from '@vapetool/types';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'redux';

interface NewFlavorModalProps extends FormComponentProps {
  showNewFlavorModal: boolean;
  dispatch: Dispatch;
}

const NewFlavorModal: React.FC<NewFlavorModalProps> = props => {
  const { showNewFlavorModal, form, dispatch } = props;
  const { getFieldDecorator } = form;
  const onCreate = () => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { name, manufacturer, percentage, price, ratio } = values;

      console.log('Received values of form: ', values);
      form.resetFields();
      dispatch({
        type: 'liquid/addFlavor',
        payload: new Flavor({ name, manufacturer, percentage, price, ratio }),
      });
      dispatch({
        type: 'liquid/hideNewFlavorModal',
      });
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'liquid/hideNewFlavorModal',
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  return (
    <Modal
      centered
      visible={showNewFlavorModal || false}
      title="Add new flavor"
      okText="Add"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="horizontal" {...formItemLayout}>
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input the flavor name!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Manufacturer">
          {getFieldDecorator('manufacturer')(<Input type="textarea" />)}
        </Form.Item>
        <Form.Item label="Percentage">
          {getFieldDecorator('percentage', {
            rules: [{ required: true, message: 'Please input the flavor percentage!' }],
          })(<InputNumber min={0} max={100} step={1} />)}
        </Form.Item>
        <Form.Item label="Price per 10ml">
          {getFieldDecorator('price')(<InputNumber min={0} step={0.1} />)}
        </Form.Item>
        <Form.Item label="PG Ratio">
          {getFieldDecorator('ratio', {
            initialValue: 100,
            rules: [{ required: true, message: 'Please input the flavor ratio!' }],
          })(<InputNumber min={0} max={100} step={10} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const form = Form.create<NewFlavorModalProps>({ name: 'new_flavor_modal' })(NewFlavorModal);

export default connect(({ liquid: { showNewFlavorModal } }: ConnectState) => ({
  showNewFlavorModal,
}))(form);
