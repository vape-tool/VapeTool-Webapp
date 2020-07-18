import { Form, Input, InputNumber, Modal, message } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl, useModel } from 'umi';
import { Flavor } from '@vapetool/types';

const NewFlavorModal = () => {
  const { addFlavor, hideFlavorModal, showNewFlavorModal } = useModel('liquid');
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const { name, manufacturer, percentage, price, ratio } = values;
    form.resetFields();
    addFlavor([new Flavor({ name, manufacturer, percentage, price, ratio })]);
    hideFlavorModal();
  };

  const onFinishFailed = (e: any) => {
    message.error(e.message);
  };

  const onCancel = () => hideFlavorModal();

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
      title={<FormattedMessage id="liquid.actions.addFlavor" defaultMessage="Add new Flavor" />}
      okText={<FormattedMessage id="misc.actions.add" defaultMessage="Add" />}
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
          label={<FormattedMessage id="misc.name" defaultMessage="Name" />}
          rules={[
            { required: true, message: useIntl().formatMessage({ id: 'liquid.validation.name' }) },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="manufacturer"
          label={<FormattedMessage id="misc.manufacturer" defaultMessage="Manufacturer" />}
        >
          <Input type="textarea" />
        </Form.Item>

        <Form.Item
          name="percentage"
          label={
            <FormattedMessage id="misc.units.long.percentage" defaultMessage="Percentage [%]" />
          }
          rules={[
            {
              required: true,
              message: useIntl().formatMessage({ id: 'liquid.validation.percentage' }),
            },
          ]}
        >
          <InputNumber min={0} max={100} step={1} />
        </Form.Item>

        <Form.Item
          name="price"
          label={<FormattedMessage id="liquid.pricePer10ml" defaultMessage="Price per 10ml" />}
        >
          <InputNumber min={0} step={0.1} />
        </Form.Item>

        <Form.Item
          name="ratio"
          label={<FormattedMessage id="liquid.pgRatioPerc" defaultMessage="PG Ratio [%]" />}
          rules={[
            {
              required: true,
              message: useIntl().formatMessage({ id: 'liquid.validation.pgRatio' }),
            },
          ]}
        >
          <InputNumber min={0} max={100} step={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewFlavorModal;
