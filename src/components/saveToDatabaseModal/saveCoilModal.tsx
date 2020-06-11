import React, { useState } from 'react';
import { Modal } from 'antd';
import { saveCoil } from '@/services/items';
import { Author } from '@vapetool/types';

export default function SaveCoilModal(props: any) {
  const [isLoading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    await saveCoil(props.coil, new Author(props.userUid, props.userName), '', '');
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
      <p>Are you sure to save coil?</p>
    </Modal>
  );
}
