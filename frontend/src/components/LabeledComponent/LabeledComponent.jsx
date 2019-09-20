import React from 'react';
import './LabeledComponent.css';

const LabeledComponent = (props) => {
  const {
    children,
    className,
    label,
    ...propsRest
  } = props;

  return (
    <div
      {...propsRest}
      className={`zd-labeled-component ${className ? className : ''}`}
    >
      <div>
        {
          children
        }
      </div>

      <div className="zd-labeled-component-label-wrapper">
        {
          label
        }
      </div>
    </div>
  );
};

export default LabeledComponent;