import React from 'react';
import Image from '../Image';
import './style.css';

const Icon = (props = {}) => {
  let {name, description, src, className} = props;
  description = description || name;

  // TODO: Set default width / height, if not already set

  return (
    <button
      className={`Icon ${className ? className : ''}`}
      title={description}
      {...props}
    >
      <Image
        className="Image"
        {...props}
        alt={name}
        title={description}
        src={src}
        width="100%"
        height="100%"
      />

      <div className="Name">
        {name}
      </div>
    </button>
  )
};

export default Icon;