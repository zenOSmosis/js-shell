import React from 'react';
import classNames from 'classnames';
import styles from './Grid.module.scss';

export const Grid = (props) => {
  let { children, className } = props;

  return (
    <div
      {...props}
      className={classNames(styles['grid'], className)}
    >
      <div className={styles['flex']}>
        <div className={styles['items-wrapper']}>
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
      className={classNames(styles['item'], className)}
    >
      {children}
    </div>
  );
};


export default Grid;