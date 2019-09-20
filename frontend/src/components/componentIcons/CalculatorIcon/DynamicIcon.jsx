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
      className={`ib2321649515e40218549989e9b3f15df-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
