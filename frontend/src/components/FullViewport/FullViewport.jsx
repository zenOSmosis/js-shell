import React, { Component } from 'react';
import classNames from 'classnames';
import style from './FullViewport.module.css';

export const EVT_RESIZE = 'resize';

export default class FullViewport extends Component {
  _base = null;
  _pollingInterval = null;

  componentDidMount() {
    this._handleViewportResize();

    window.addEventListener(EVT_RESIZE, this._handleViewportResize);

    this._pollingInterval = setInterval(this._handleViewportResize, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener(EVT_RESIZE, this._handleViewportResize);

    clearInterval(this._pollingInterval);
  }

  componentDidUpdate() {
    this._handleViewportResize();
  }

  /**
   * Automatically called after rendering.
   */
  _handleViewportResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    document.body.scrollTop = 0;

    this._base.style.width = `${width}px`;
    this._base.style.height = `${height}px`;
  }

  render() {
    let { children, className, ...propsRest } = this.props;

    return (
      <div
        ref={c => this._base = c}
        {...propsRest}
        className={classNames(style['full-viewport'], className)}
      >
        {children}
      </div>
    );
  }
}