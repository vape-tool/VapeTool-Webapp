import * as React from 'react';
import { Card, Typography } from 'antd';
import { Wire, WireType } from '@vapetool/types';

export interface WireComponentProps {
  wire: Wire;
}

const SingleWire: React.FC<WireComponentProps> = props => {
  const { wire } = props;

  return (
    <Card>
      <Typography>{WireType[wire.type]}</Typography>
    </Card>
  )
};

export default SingleWire;
