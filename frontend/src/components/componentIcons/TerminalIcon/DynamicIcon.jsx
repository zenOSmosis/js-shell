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
      className={`ibe29693f53ab466787f45409d0ebce78-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
