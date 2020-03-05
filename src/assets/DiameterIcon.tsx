import Icon from '@ant-design/icons';
import React from 'react';

const DiameterSvg = () => (
  <svg viewBox="0 0 500 500" width="1em" height="1em" fill="currentColor">
    <path
      fill="#464655"
      d="M 500 250 C 500 388.071 388.071 500 250 500 C 111.929 500 0 388.071 0 250 C 0 111.929 111.929 0 250 0 C 388.071 0 500 111.929 500 250 Z M 163.307 126.557 L 200.905 88.959 L 90.325 90.096 L 89.188 200.676 L 126.068 163.796 L 335.53 373.259 L 298.656 410.133 L 409.236 408.996 L 410.373 298.416 L 372.769 336.02 Z"
    />
  </svg>
);

const DiameterIcon = (props: any) => <Icon component={DiameterSvg} {...props} />;
export default DiameterIcon;
