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
      className={`i5ce92d24e1c944609fb969632229d018-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
