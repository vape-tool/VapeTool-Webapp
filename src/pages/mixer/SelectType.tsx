import React from 'react';
import Select from 'antd/es/select';

const { Option } = Select;

export default function() {
  return (
    <Select defaultValue={1} style={{ display: 'flex', margin: 'auto' }}>
      <Option value={1}>Premix</Option>
      <Option value={2}>Base (NicoShot)</Option>
      <Option value={3}>E-Liquid</Option>
    </Select>
  );
}
