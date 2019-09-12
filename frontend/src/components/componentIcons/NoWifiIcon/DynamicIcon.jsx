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
      className={`if03d5925f02a4089b3f3b3365e8c019f-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
