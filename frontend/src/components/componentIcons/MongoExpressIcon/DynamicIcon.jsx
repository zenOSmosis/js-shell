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
      className={`if4a658df8f8b42f49d0d2f1dd548695d-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
