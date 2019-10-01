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
      className={`icad23eb18db64d2baca48ea8c32227ef-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
