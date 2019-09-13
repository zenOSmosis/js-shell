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
      className={`ic9290714a7174239a414a53d3598073a-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
