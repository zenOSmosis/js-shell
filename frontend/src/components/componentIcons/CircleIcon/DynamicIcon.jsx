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
      className={`iac502cc0d3d44cbdbacc00ae3d55a7c9-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
