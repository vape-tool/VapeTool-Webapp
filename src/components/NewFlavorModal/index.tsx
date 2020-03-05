import { Form, Input, InputNumber, Modal, message } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { Flavor } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import { dispatchAddFlavor, dispatchHideNewFlavorModal } from '@/models/liquid';

interface NewFlavorModalProps extends ConnectProps {
  showNewFlavorModal?: boolean;
}

const NewFlavorModal: React.FC<NewFlavorModalProps> = props => {
  const { showNewFlavorModal, dispatch } = props;
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const { name, manufacturer, percentage, price, ratio } = values;
    form.resetFields();
    dispatchAddFlavor(dispatch, new Flavor({ name, manufacturer, percentage, price, ratio }));
    dispatchHideNewFlavorModal(dispatch);
  };

  const onFinishFailed = (e: any) => {
    message.error(e.message);
  };

  const onCancel = () => dispatchHideNewFlavorModal(dispatch);

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
      onOk={() => form.submit()}
    >
      <Form
        name="newFlavorModal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="horizontal"
        {...formItemLayout}
        form={form}
        component={false}
        initialValues={{ ratio: 100 }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the flavor name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="manufacturer" label="Manufacturer">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="percentage"
          label="Percentage"
          rules={[{ required: true, message: 'Please input the flavor percentage!' }]}
        >
          <InputNumber min={0} max={100} step={1} />
        </Form.Item>
        <Form.Item name="price" label="Price per 10ml">
          <InputNumber min={0} step={0.1} />
        </Form.Item>
        <Form.Item
          name="ratio"
          label="PG Ratio"
          rules={[{ required: true, message: 'Please input the flavor ratio!' }]}
        >
          <InputNumber min={0} max={100} step={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ liquid: { showNewFlavorModal } }: ConnectState) => ({
  showNewFlavorModal,
}))(NewFlavorModal);
