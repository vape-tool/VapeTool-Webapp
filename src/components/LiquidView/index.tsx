import React from 'react';
import { Liquid } from '@/types';

interface LiquidViewProps {
  item: Liquid;
}

const LiquidView: React.FC<LiquidViewProps> = props => <div>{props.item.name}</div>;
export default LiquidView;
