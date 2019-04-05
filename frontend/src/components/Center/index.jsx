import React from 'react';
import './style.css';

const Center = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      className={`Center ${className ? className : ''}`}
      {...propsRest}
    >
      <div className="CenterItem">
        {
          children
        }
      </div>
    </div>
  );
};

export default Center;