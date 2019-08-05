import React from 'react';
import Image from '../Image';
import textEllipsis from 'text-ellipsis';
import { Tooltip } from 'antd';
import './style.css';

const Icon = (props = {}) => {
  let {title, children, width, height, style, maxTitleLength, description, src, className, ...propsRest} = props;

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
      {
        // TODO: Consider encapuslating in Cover
        children &&
        children
      }
      {
        // TODO: Consider encapuslating in Cover
        src &&
        <Image
          className="zd-icon-image"
          alt={description}
          title={description}
          src={src}
          width="100%"
          height="100%"
        />
      }

      {
        // // TODO: Consider encapuslating in Cover
      }
      <Tooltip title={title} placement="bottom">
        <div className="zd-icon-name">
          {
            title &&
            textEllipsis(title, maxTitleLength)
          }
        </div>
      </Tooltip>
      
    </button>
  )
};

export default Icon;