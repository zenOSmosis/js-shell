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
      className={`i3efb50a4dce443cfb6c490ac2c8231df-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
