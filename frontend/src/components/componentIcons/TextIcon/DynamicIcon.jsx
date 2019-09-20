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
      className={`if3e9801833f04021b5832081d73af276-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
