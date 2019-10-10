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
      className={`if509c10410af4292b70fa3193c46fcef-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
