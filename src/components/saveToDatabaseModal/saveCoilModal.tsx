import React, { useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { saveCoil } from '@/services/items';
import { Author } from '@vapetool/types';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi-plugin-react/locale';

export default function SaveCoilModal(props: any) {
  const [isLoading, setLoading] = useState(false);
  const [coilName, setCoilName] = useState('');
  const [coilDescription, setCoilDescription] = useState('');

  const handleOk = async () => {
    setLoading(true);
    await saveCoil(
      props.coil,
      new Author(props.userUid, props.userName),
      coilName,
      coilDescription,
    );
    setTimeout(() => {
      setLoading(false);
      props.setVisible(false);
    }, 200);
  };
  const handleCancel = async () => {};
  return (
    <Modal
      title="Title"
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={isLoading}
      onCancel={handleCancel}
    >
      <Form onSubmitCapture={e => e.preventDefault()}>
        <FormItem label={<FormattedMessage id="coil.name" defaultMessage="Coil name" />}>
          <Input
            placeholder="Coil name"
            value={coilName}
            onChange={e => setCoilName(e.target.value)}
          />
        </FormItem>
      </Form>
      <FormItem
        label={<FormattedMessage id="coil.description" defaultMessage="Coil description" />}
      >
        <Input
          placeholder="Coil description"
          value={coilDescription}
          onChange={e => setCoilDescription(e.target.value)}
        />
      </FormItem>
    </Modal>
  );
}
