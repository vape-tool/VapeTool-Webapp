import { Form, Input, Modal } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';

interface NewAffiliateModalProps extends ConnectProps {
  showNewAffiliateModal?: boolean;
}

const NewAffiliateModal: React.FC<NewAffiliateModalProps> = props => {
  const { showNewAffiliateModal, dispatch } = props;
  const [form] = Form.useForm();

  const onFinished = (values: any) => {
    form.resetFields();

    dispatch({
      type: 'batteries/setAffiliate',
      affiliate: { ...values },
    });
    dispatch({
      type: 'batteries/hideNewAffiliateModal',
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'batteries/hideNewAffiliateModal',
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
      visible={showNewAffiliateModal || false}
      title="Add new affiliate"
      okText="Add"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form layout="horizontal" {...formItemLayout} form={form} onFinish={onFinished}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the affiliate name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="link"
          label="Link"
          rules={[{ required: true, message: 'Please input the affiliate link!' }]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ batteries }: ConnectState) => ({
  showNewAffiliateModal: batteries.showNewAffiliateModal,
}))(NewAffiliateModal);
