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
      className={`ibb78046924f042fe824404c8ed611703-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
