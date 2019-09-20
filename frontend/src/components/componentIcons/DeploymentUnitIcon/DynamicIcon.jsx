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
      className={`ib5ef965084104a4384f0b0c01303aaac-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
