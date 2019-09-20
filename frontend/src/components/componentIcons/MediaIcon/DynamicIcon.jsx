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
      className={`ifeddd832cd754172937e2315d49aacd8-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
