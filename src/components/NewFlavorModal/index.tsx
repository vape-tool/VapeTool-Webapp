import { Form, Input, InputNumber, Modal } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Flavor } from '@vapetool/types';
import { ConnectState, Dispatch } from '@/models/connect';

interface NewFlavorModalProps extends FormComponentProps {
  showNewFlavorModal: boolean;
  dispatch: Dispatch
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
      })
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'liquid/hideNewFlavorModal',
    })
  };
  return (
    <Modal
      visible={showNewFlavorModal || false}
      title="Add new flavor"
      okText="Add"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="Manufacturer">
          {getFieldDecorator('manufacturer')(<Input type="textarea"/>)}
        </Form.Item>
        <Form.Item label="Percentage">
          {getFieldDecorator('percentage')(<InputNumber/>)}
        </Form.Item>
        <Form.Item label="Price">
          {getFieldDecorator('price')(<InputNumber/>)}
        </Form.Item>
        <Form.Item label="Ratio">
          {getFieldDecorator('ratio')(<InputNumber/>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const form = Form.create<NewFlavorModalProps>({ name: 'new_flavor_modal' })(NewFlavorModal);

export default connect(({ liquid: { showNewFlavorModal } }: ConnectState) =>
  ({ showNewFlavorModal }))(form)
