import React from 'react';
import './style.css';

/**
 * Dynamically generated ReactComponent.
 */ 
const DynamicIcon = (props) => {
  const { className, ...propsRest } = props;

  return (
    <i
      {...propsRest}
      className={`iac3e64433e9442bb9a0c1c45dc389b7e-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
