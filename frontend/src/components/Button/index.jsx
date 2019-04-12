import React from 'react';
import { Button as RSButton } from 'antd';

const Button = (props = {}) => {
  const {children, size: propsSize, ...propsRest} = props;

  const size = propsSize || 'small';

  return (
    <RSButton
      {...propsRest}
      size={size}
    >
      {
        children
      }
    </RSButton>
  );
}

export default RSButton;