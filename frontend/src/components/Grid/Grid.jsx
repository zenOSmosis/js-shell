import React from 'react';
import classNames from 'classnames';
import style from './Grid.module.scss';

export const Grid = (props) => {
  let { children, className } = props;

  return (
    <div
      {...props}
      className={classNames(style['grid'], className)}
    >
      <div className={style['flex']}>
        <div className={style['items-wrapper']}>
          {
            children
          }
        </div>
      </div>
    </div>
  );
};

/**
 * Contained within GridItemWrapper.
 */
export const GridItem = (props) => {
  const { children, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={classNames(style['item'], className)}
    >
      {children}
    </div>
  );
};


export default Grid;