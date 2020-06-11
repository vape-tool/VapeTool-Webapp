import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi-plugin-react/locale';

export default function SaveModal(props: any) {
  const [isLoading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    await props.save();
    setTimeout(() => {
      setLoading(false);
      props.setVisible(false);
    }, 200);
  };
  const handleCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      title="Save"
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={isLoading}
      onCancel={handleCancel}
    >
      <FormItem label={<FormattedMessage id="misc.name" defaultMessage="Name" />}>
        <Input
          placeholder="Name"
          value={props.name}
          onChange={e => props.setName(e.target.value)}
        />
      </FormItem>
      <FormItem label={<FormattedMessage id="misc.description" defaultMessage="Description" />}>
        <Input
          placeholder="Description"
          value={props.description}
          onChange={e => props.setDescription(e.target.value)}
        />
      </FormItem>
    </Modal>
  );
}
