import { Form, Input, Modal } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';

interface NewAffiliateModalProps extends FormComponentProps {
  showNewAffiliateModal: boolean;
  dispatch: Dispatch;
}

const NewAffiliateModal: React.FC<NewAffiliateModalProps> = props => {
  const { showNewAffiliateModal, form, dispatch } = props;
  const { getFieldDecorator } = form;
  const onCreate = () => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      form.resetFields();

      dispatch({
        type: 'batteries/setAffiliate',
        affiliate: { ...values },
      });
      dispatch({
        type: 'batteries/hideNewAffiliateModal',
      });
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
      onOk={onCreate}
    >
      <Form layout="horizontal" {...formItemLayout}>
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input the affiliate name!' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Link">
          {getFieldDecorator('link', {
            rules: [{ required: true, message: 'Please input the affiliate link!' }],
          })(<Input type="textarea" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const form = Form.create<NewAffiliateModalProps>({ name: 'new_affiliate_modal' })(
  NewAffiliateModal,
);

export default connect(({ batteries }: ConnectState) => ({
  showNewAffiliateModal: batteries.showNewAffiliateModal,
}))(form);
