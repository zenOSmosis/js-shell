import React from 'react';
import Cover from 'components/Cover';

const Tile = (props) => {
  const { children, className, title, ...propsRest } = props;

  return (
    <button
      {...propsRest}
      className={`zd-tile-list-tile ${className ? className : ''}`}
    >
      {
        children
      }
      <Cover>
        <div className="title">
          { title }
        </div>
      </Cover>
    </button>
  )
};

export default Tile;