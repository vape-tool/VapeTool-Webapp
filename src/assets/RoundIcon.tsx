import { Icon } from 'antd';
import React from 'react';

const RoundSvg = () => (
  <svg viewBox="0 0 50 50" width="1em" height="1em" fill="currentColor">
    <circle cx="25" cy="25" r="25" fill="#464655" />
  </svg>
);

const RoundIcon = (props: any) => <Icon component={RoundSvg} {...props} />;
export default RoundIcon;
