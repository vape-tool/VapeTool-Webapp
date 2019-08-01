import * as React from 'react';
import { Card, Typography } from 'antd';
import { WiresTree, WireType } from '@vapetool/types';

export interface WireComponentProps {
  wiresTree: WiresTree;
}

const ComplexWire: React.FC<WireComponentProps> = props => {
  const { wiresTree } = props;

  return (
    <Card>
      <Typography>{WireType[wiresTree.type]}</Typography>
    </Card>
  )
};

export default ComplexWire;
