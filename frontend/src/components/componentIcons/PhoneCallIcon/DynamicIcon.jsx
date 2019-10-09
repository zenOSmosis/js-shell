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
      className={`iee268d37eaad4382b66e6b68c0f5494c-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
