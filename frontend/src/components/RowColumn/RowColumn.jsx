import React from 'react';
import classNames from 'classnames';
import styles from './RowColumn.module.scss';
import PropTypes from 'prop-types';

// @see https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01

const Row = (props = {}) => {
  const { children, className, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={classNames(styles['row'], className)}
    >
      {
        children
      }
    </div>
  );
};

/**
 * Evenly-sized column.
 */
const Column = (props = {}) => {
  const { children, className, isForcedMinWidth, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={
        classNames(
          styles['column'],
          isForcedMinWidth ? styles['forced-min-width'] : null,
          className
        )
      }
    >
      {
        children
      }
    </div>
  );
};

Column.propTypes = {
  isForcedMinWidth: PropTypes.bool
};

export default Row;
export {
  Column
};