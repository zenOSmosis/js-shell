import React from 'react';
import './style.css';

// @see https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01

const Row = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      {...propsRest}
      className={`zd-row ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  );
};

/**
 * Evenly-sized column.
 */
const Column = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      {...propsRest}
      className={`zd-column ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  );
};

export {
  Row,
  Column
};