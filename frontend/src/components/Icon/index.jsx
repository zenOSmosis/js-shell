import React from 'react';
import Image from '../Image';
import './style.css';

const Icon = (props = {}) => {
  let {title, description, src, className, ...propsRest} = props;

  // TODO: Set default width / height, if not already set

  return (
    <button
      className={`Icon ${className ? className : ''}`}
      title={description}
      {...propsRest}
    >
      <Image
        className="Image"
        alt={description}
        title={description}
        src={src}
        width="100%"
        height="100%"
      />

      <div className="Name">
        {title}
      </div>
    </button>
  )
};

export default Icon;