import { Form, Input, Modal } from 'antd';
import * as React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { FormattedMessage } from '@umijs/preset-react';
import { i18nValidationRequired } from '@/utils/i18n';

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

  const affiliateName = (
    <FormattedMessage id="battery.affiliateName" defaultMessage="Affiliate name" />
  );
  const affiliateLink = (
    <FormattedMessage id="battery.affiliateLink" defaultMessage="Affiliate link" />
  );

  return (
    <Modal
      centered
      visible={showNewAffiliateModal || false}
      title={
        <FormattedMessage id="battery.actions.addNewAffiliate" defaultMessage="Add new affiliate" />
      }
      okText={<FormattedMessage id="misc.actions.add" defaultMessage="Add" />}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form layout="horizontal" {...formItemLayout} form={form} onFinish={onFinished}>
        <Form.Item
          name="name"
          label={affiliateName}
          rules={[{ required: true, message: i18nValidationRequired(affiliateName) }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="link"
          label={affiliateLink}
          rules={[{ required: true, message: i18nValidationRequired(affiliateLink) }]}
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
