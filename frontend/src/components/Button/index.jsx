import React from 'react';
import { Button as RSButton } from 'antd';
import './style.css';

const Button = (props = {}) => {
  const {className, active: propsActive, size: propsSize, ...propsRest} = props;

  const size = propsSize || 'small';
  const active = (propsActive ? true : false);

  return (
    <RSButton
      {...propsRest}
      size={size}
      className={`zd-button ${active ? 'active': ''} ${className ? className : ''}`}
    />
  );
}

export default Button;
export {
  Button
};