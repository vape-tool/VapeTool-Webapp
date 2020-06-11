import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { saveLiquid } from '@/services/items';
import { Author } from '@vapetool/types';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi-plugin-react/locale';

export default function SaveLiquidModal(props: any) {
  const [isLoading, setLoading] = useState(false);
  const [liquidName, setLiquidName] = useState('');
  const [liquidDescription, setLiquidDescription] = useState('');

  const handleOk = async () => {
    setLoading(true);
    await saveLiquid(
      props.currentLiquid,
      new Author(props.userUid, props.userName),
      liquidName,
      liquidDescription,
    );
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
      title="Title"
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={isLoading}
      onCancel={handleCancel}
    >
      <FormItem label={<FormattedMessage id="liquid.name" defaultMessage="Liquid name" />}>
        <Input
          placeholder="Liquid name"
          value={liquidName}
          onChange={e => setLiquidName(e.target.value)}
        />
      </FormItem>
      <FormItem
        label={<FormattedMessage id="liquid.description" defaultMessage="Liquid description" />}
      >
        <Input
          placeholder="Liquid description"
          value={liquidDescription}
          onChange={e => setLiquidDescription(e.target.value)}
        />
      </FormItem>
    </Modal>
  );
}
