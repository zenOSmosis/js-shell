import React, { Component } from 'react';
import Window from '../Window';
import Gesture from 'components/Gesture';
import { Row, Column } from 'components/Layout';

export default class WindowHeader extends Component {
  constructor(...args) {
    super(...args);

    this._initialWindowPosition = {};
    this._initialTouchPosition = {};

    const { desktopWindow } = this.props;
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be instance of Window');
    }
  }

  _handleGestureStart(evt) {
    const { desktopWindow, onGestureStart } = this.props;

    if (typeof onGestureStart === 'function') {
      onGestureStart(evt);
    }

    this._initialWindowPosition = desktopWindow.getPosition();
  }

  _handleGestureMove(evt) {
    const { desktopWindow } = this.props;
    const { x: initialWinPosX, y: initialWinPosY } = this._initialWindowPosition;

    const deltaX = evt.delta[0];
    const deltaY = evt.delta[1];

    const newX = initialWinPosX + deltaX;
    const newY = initialWinPosY + deltaY;

    desktopWindow.moveTo(newX, newY);
  }

  // TODO: Handle touch end (if necessary)
  _handleGestureEnd(evt) {
    const { onGestureEnd } = this.props;

    if (typeof onGestureEnd === 'function') {
      onGestureEnd(evt);
    }
  }

  render() {
    const {
        onGestureStart,
        onGestureEnd,
        desktopWindow,
        className,
        title,
        toolbarRight,
        subToolbar,
        ...propsRest
    } = this.props;

    let {
      toolbar
    } = this.props;

    if (!toolbar) {
      // TODO: Implement marginTop specifically for relevant browser
      // 2 - 3 works best on Chrome
      // 3 - 4 works best on Firefox

      // @see https://css-tricks.com/almanac/properties/t/text-overflow/
      // TODO: Move styles to style.css
      toolbar = (
        <div style={{
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          verticalAlign: 'middle'
        }}>
          {(title ? title : <span>&nbsp;</span>)}
        </div>
      );
    }

    return (
      <div
        {...propsRest}
        className = {`zd-window-header ${className ? className : ''}`
      }
      >
  <Gesture
    touch={true}
    mouse={true}
    onDown={(evt) => this._handleGestureStart(evt)}
    onMove={(evt) => this._handleGestureMove(evt)}
    onUp={(evt) => this._handleGestureEnd(evt)}
  >
    {
      // Header content area is rendered in here
    }
    <div>
      <Row>
        {
          // TODO: Move styles to styles.css
        }
        <Column style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            whiteSpace: 'nowrap',
            paddingLeft: 2,
            overflow: 'hidden',
            position: 'relative',
          }}>
            {
              // TODO: Move dots to their own view
            }
            {
              // Red dot
            }
            <button
              className="zd-dot red"
              onClick={(evt) => desktopWindow.close()}
            ></button>

            {
              // Yellow dot
            }
            <button
              className="zd-dot yellow"
              onClick={(evt) => desktopWindow.toggleMinimize()}
            ></button>

            {
              // Green dot
            }
            <button
              className="zd-dot green"
              onClick={(evt) => desktopWindow.toggleMaximize()}
            ></button>
          </div>
        </Column>
        <Column style={{ textAlign: 'center' }}>
          <div style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center', fontWeight: 'bold', display: 'inline-block', verticalAlign: 'middle' }}>
            {
              toolbar
            }
          </div>
        </Column>
        <Column style={{ textAlign: 'right' }}>
          <div className="column right">
            {
              toolbarRight
            }
          </div>
        </Column>
      </Row>
    </div>

    {
      subToolbar &&
      <div className="zd-sub-toolbar">
        {
          subToolbar
        }
      </div>
    }

  </Gesture>
      </div >
    );
  }
};