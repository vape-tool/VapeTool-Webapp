import { Form, Input, InputNumber, Modal, message } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { Flavor } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import { dispatchAddFlavor, dispatchHideNewFlavorModal } from '@/models/liquid';
import { FormattedMessage } from 'umi-plugin-react/locale';

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
      title={<FormattedMessage id="liquid.actions.addFlavor" />}
      okText={<FormattedMessage id="misc.actions.add" />}
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
          label={<FormattedMessage id="misc.name" />}
          rules={[{ required: true, message: 'Please input the flavor name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="manufacturer" label={<FormattedMessage id="misc.manufacturer" />}>
          <Input type="textarea" />
        </Form.Item>

        <Form.Item
          name="percentage"
          label={<FormattedMessage id="misc.units.long.percentage" />}
          rules={[{ required: true, message: 'Please input the flavor percentage!' }]}
        >
          <InputNumber min={0} max={100} step={1} />
        </Form.Item>

        <Form.Item name="price" label={<FormattedMessage id="liquid.pricePer10ml" />}>
          <InputNumber min={0} step={0.1} />
        </Form.Item>

        <Form.Item
          name="ratio"
          label={<FormattedMessage id="liquid.pgRatioPerc" />}
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
