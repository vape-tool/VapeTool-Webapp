import { Icon } from 'antd';
import React from 'react';

const OuterSvg = () => (
  <svg viewBox="0 0 24 24" width="2em" height="1.5em" fill="currentColor">
    <path
      fillOpacity={1}
      d="M 19.287 12.042 C 19.287 16.074 16.019 19.342 11.987 19.342 C 7.955 19.342 4.687 16.074 4.687 12.042 C 4.687 8.01 7.955 4.742 11.987 4.742 C 16.019 4.742 19.287 8.01 19.287 12.042 Z M 12 0 C 5.373 0 0 5.373 0 12 C 0 18.627 5.373 24 12 24 C 18.627 24 24 18.627 24 12 C 24 5.373 18.627 0 12 0 Z"
    />
    <circle fillOpacity={0.5} cx="11.987" cy="12.042" r="7.3" />
  </svg>
);

const OuterIcon = (props: any) => <Icon component={OuterSvg} {...props} />;
export default OuterIcon;
