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
      className={`ida027b1354db4a82960f8ec222671135-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
