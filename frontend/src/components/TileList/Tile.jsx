import React from 'react';
import Cover from 'components/Cover';
import ellipses from 'text-ellipsis';

const Tile = (props) => {
  const { children, className, header, title: propsTitle, ...propsRest } = props;

  const title = (propsTitle ? propsTitle.toString() : '').trim();

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
          { 
            // TODO: Move header outside of outer button DOM descendants, so we
            // can include additional buttons w/o triggering invalidation
            // warnings
            header
          }
        </div>

        <div className="title">
          { ellipses(title, 40) }
        </div>
      </Cover>
    </button>
  )
};

export default Tile;