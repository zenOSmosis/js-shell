import React from 'react';
import Full from '../Full';
import style from './Scrollable.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const DEFAULT_SCROLL_X_IS_ENABLED = true;
const DEFAULT_SCROLL_Y_IS_ENABLED = true;

const Scrollable = (props = {}) => {
  const { className, children, ...propsRest } = props;

  let { allowScrollX, allowScrollY } = props;
  allowScrollX = (allowScrollX === undefined ? DEFAULT_SCROLL_X_IS_ENABLED : allowScrollX);
  allowScrollY = (allowScrollY === undefined ? DEFAULT_SCROLL_Y_IS_ENABLED : allowScrollY);

  return (
    <Full
      {...propsRest}
      className={classNames(
        (allowScrollY ? style['scroll-y'] : ''),
        (allowScrollX ? style['scroll-x'] : ''),
        className
      )}
    >
      {
        children
      }
    </Full>
  );
};

Scrollable.propTypes = {
  allowScrollX: PropTypes.bool,
  allowScrollY: PropTypes.bool
};

export default Scrollable;