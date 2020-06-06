import React from 'react';
import Select from 'antd/es/select';
import { MixableType } from '@vapetool/types';

const { Option } = Select;

export default function(props: any) {
  return (
    <Select
      onChange={type => {
        props.onChange({
          ...props.mixable,
          type,
        });
      }}
      defaultValue={props.mixable.type}
      style={{ display: 'flex', margin: 'auto' }}
    >
      <Option value={MixableType.PREMIX}>Premix</Option>
      <Option value={MixableType.BASE}>Base (NicoShot)</Option>
      <Option value={MixableType.LIQUID}>E-Liquid</Option>
    </Select>
  );
}
