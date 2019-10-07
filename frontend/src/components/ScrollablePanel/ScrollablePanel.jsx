import React, { Component } from 'react';
import styles from './ScrollablePanel.module.css';
import classNames from 'classnames';
import Scrollable from '../Scrollable';

const HORIZONTAL_ORIENTATION = 'horizontal';
// const VERTICAL_ORIENTATION = 'vertical';

/**
 * @extends React.Component
 */
class ScrollablePanel extends Component {
  constructor(...args) {
    super(...args);

    this._scrollableComponent = null;

    // TODO: Automatically detect orientation
    this._orientation = HORIZONTAL_ORIENTATION;
  }

  _handleWheelScroll(deltaX, deltaY) {
    let delta = deltaX || deltaY;

    // Fix slow scrolling in Firefox, etc.
    if (Math.abs(delta) < 5) {
      delta = delta * 10;
    }

    if (this._orientation === HORIZONTAL_ORIENTATION) {
      this._scrollableComponent.scrollLeftDelta(delta);
    } else {
      this._scrollableComponent.scrollTopDelta(delta);
    }
  }

  render() {
    const {
      className,
      children: tabs,
      ...propsRest
    } = this.props;
    
    return (
      <div
        {...propsRest}
        className={classNames(styles['scrollable-panel'], className)}
      >
        {
          // TODO: Only allow scrolling according to orientation
        }
        <Scrollable
          ref={ c => this._scrollableComponent = c }
          // TODO: Handle horizontal overflow scrolling
          onWheel={evt => this._handleWheelScroll(evt.deltaX, evt.deltaY)}
        >
          {
            tabs
          }
        </Scrollable>
      </div>
    );
  }
}

export default ScrollablePanel;