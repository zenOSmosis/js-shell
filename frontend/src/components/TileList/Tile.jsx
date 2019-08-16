import React from 'react';
import Cover from 'components/Cover';

const Tile = (props) => {
  const { children, className, header, title, ...propsRest } = props;

  return (
    <button
      {...propsRest}
      className={`zd-tile-list-tile ${className ? className : ''}`}
    >
      {
        children
      }
      <Cover>
        <div className="header">
          { header }
        </div>

        <div className="title">
          { title }
        </div>
      </Cover>
    </button>
  )
};

export default Tile;