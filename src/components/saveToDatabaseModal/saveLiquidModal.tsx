import React, { useState } from 'react';
import { Modal } from 'antd';
import { saveLiquid } from '@/services/items';
import { Author } from '@vapetool/types';

export default function SaveLiquidModal(props: any) {
  const [isLoading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    await saveLiquid(props.currentLiquid, new Author(props.userUid, props.userName), '', '');
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
      <p>Are you sure to save liquid?</p>
    </Modal>
  );
}
