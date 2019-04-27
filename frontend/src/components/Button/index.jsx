import React from 'react';
import { Button as RSButton } from 'antd';

const Button = (props = {}) => {
  const {className, size: propsSize, ...propsRest} = props;

  const size = propsSize || 'small';

  return (
    <RSButton
      {...propsRest}
      size={size}
      className={`Button ${className ? className : ''}`}
    />
  );
}

export default Button;
export {
  Button
};