import React, { Component } from 'react';
import style from './TabBar.module.css';
import classNames from 'classnames';

/**
 * @extends React.Component
 */
class TabBar extends Component {
  render() {
    const {
      className,
      children,
      ...propsRest
    } = this.props;

    return (
      <div
        {...propsRest}
        className={classNames(style['tab-bar'], className)}

        // TODO: Handle horizontal overflow scrolling
        onWheel={evt => console.debug({
          deltaX: evt.deltaX,
          deltyY: evt.deltaY
        })}
      >
        {children}
      </div>
    );
  }
}

export default TabBar;