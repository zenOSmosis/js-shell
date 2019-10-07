import React, { Component } from 'react';
import style from './Scrollable.module.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const DEFAULT_SCROLL_X_IS_ENABLED = true;
const DEFAULT_SCROLL_Y_IS_ENABLED = true;

class Scrollable extends Component {
  static propTypes = {
    allowScrollX: PropTypes.bool,
    allowScrollY: PropTypes.bool,
    isScrollToBottom: PropTypes.bool
  };

  constructor(...args) {
    super(...args);

    this._root = null;
    this._scrollLeft = 0;
    this._scrollTop = 0;
  }

  componentDidMount() {
    this._root.onscroll = (evt) => {
      const { scrollLeft, scrollTop } = evt.target;
      
      this._scrollLeft = scrollLeft;
      this._scrollTop = scrollTop;
    };

    this._autoScrollToBottom();
  }

  componentDidUpdate() {
    this._autoScrollToBottom();
  }

  /**
   * Automatically scrolls to the bottom if isScrollToBottom property is set to
   * true.
   */
  _autoScrollToBottom() {
    const { isScrollToBottom } = this.props;

    if (isScrollToBottom) {
      this._root.scrollTop = this._root.scrollHeight;
    }
  }

  /**
   * Scrolls the component left by the given delta, in pixels.
   * 
   * @param {number} delta Number of pixels
   */
  scrollLeftDelta(delta) {
    const newScrollLeft = this._scrollLeft + parseInt(delta);

    this._root.scrollLeft = newScrollLeft;
  }

  /**
   * Scrolls the component up by the given delta, in pixels.
   * 
   * @param {number} delta Number of pixels
   */
  scrollTopDelta(delta) {
    const newScrollTop = this._scrollLeft + parseInt(delta);

    this._root.scrollTop = newScrollTop;
  }

  render() {
    const {
      className,
      children,
      isScrollToBottom,
      ...propsRest
    } = this.props;
  
    let { allowScrollX, allowScrollY } = this.props;
    allowScrollX = (allowScrollX === undefined ? DEFAULT_SCROLL_X_IS_ENABLED : allowScrollX);
    allowScrollY = (allowScrollY === undefined ? DEFAULT_SCROLL_Y_IS_ENABLED : allowScrollY);
  
    return (
      <div
        {...propsRest}
        ref={ c => this._root = c }
        className={classNames(
          style['scrollable'],
          (allowScrollY ? style['scroll-y'] : ''),
          (allowScrollX ? style['scroll-x'] : ''),
          className
        )}
      >
        {
          children
        }
      </div>
    );
  }
}

export default Scrollable;