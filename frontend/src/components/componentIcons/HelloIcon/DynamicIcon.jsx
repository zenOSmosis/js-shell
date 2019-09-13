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
      className={`ic204941680db47e4871c21b4abf1264b-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
