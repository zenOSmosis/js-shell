import React from 'react';
import Image from '../Image';
import textEllipsis from 'text-ellipsis';
import './style.css';

const Icon = (props = {}) => {
  let {title, width, height, style, maxTitleLength, description, src, className, ...propsRest} = props;

  maxTitleLength = maxTitleLength || 10;

  style = Object.assign(
    style || {},
    {
      width,
      height
    }
  );


  // TODO: Set default width / height, if not already set

  return (
    <button
      {...propsRest}
      className={`zd-icon ${className ? className : ''}`}
      title={description}
      style={style}
    >
      <Image
        className="zd-icon-image"
        alt={description}
        title={description}
        src={src}
        width="100%"
        height="100%"
      />

      <div className="zd-icon-name">
        {
          // TODO: Make ellipsis length configurable 
        }
        {textEllipsis(title, maxTitleLength)}
      </div>
    </button>
  )
};

export default Icon;