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
      className={`i02eb752853034a75a041867a84edb7f9-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
