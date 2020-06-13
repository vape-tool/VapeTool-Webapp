import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi-plugin-react/locale';

interface SaveModalProps {
  save: (name: string, description?: string) => Promise<void>;
  setVisible: (isVisible: boolean) => void;
  visible: boolean;
}

export default function SaveModal(props: SaveModalProps) {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOk = async () => {
    setLoading(true);
    await props.save(name, description);
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
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      </FormItem>
      <FormItem label={<FormattedMessage id="misc.description" defaultMessage="Description" />}>
        <Input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </FormItem>
    </Modal>
  );
}
