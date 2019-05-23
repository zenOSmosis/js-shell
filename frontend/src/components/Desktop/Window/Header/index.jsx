import React, {Component} from 'react';
// import Window from '../Window';
import Gesture from 'components/Gesture';
import {Row, Column} from 'components/Layout';

export default class WindowHeader extends Component {
  _initialWindowPosition = {};
  _initialTouchPosition = {};

  /*
  constructor(props) {
    super(props);

    // const {desktopWindow} = this.props;
    // TODO: Can we make this work w/ a hocConnect'ed window?
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be instance of Window');
    }
  }
  */

  _handleTouchStart = (evt) => {
    const {desktopWindow} = this.props;
  
    this._initialWindowPosition = desktopWindow.getPosition();
  }

  _handleTouchMove = (evt) => {
    const {desktopWindow} = this.props;
    const {x: initialWinPosX, y: initialWinPosY} = this._initialWindowPosition;

    const deltaX = evt.delta[0];
    const deltaY = evt.delta[1];

    const newX = initialWinPosX + deltaX;
    const newY = initialWinPosY + deltaY;

    desktopWindow.moveTo(newX, newY);
  }

  // TODO: Handle touch end (if necessary)
  _handleTouchEnd = (evt) => {
    // console.debug('touch end', evt);
  }

  render() {
    let {desktopWindow, className, title, toolbar, toolbarRight, subToolbar, ...propsRest} = this.props;
    
    if (!toolbar) {
      // TODO: Implement marginTop specifically for relevant browser
      // 2 - 3 works best on Chrome
      // 3 - 4 works best on Firefox

      // @see https://css-tricks.com/almanac/properties/t/text-overflow/
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
        className={`zd-window-header ${className ? className : ''}`}
      >
        <Gesture
          touch={true}
          mouse={true}
          onDown={(evt) => this._handleTouchStart(evt)}
          onMove={(evt) => this._handleTouchMove(evt)}
          onUp={(evt) => this._handleTouchEnd(evt)}
        >
          {
            // Header content area is rendered in here
          }
          <div>
            <Row>
              {
                // TODO: Move styles to CSS declaration
              }
              <Column style={{textAlign: 'left'}}>
                <div style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                    paddingLeft: 2,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                  <button
                    className="zd-dot red"
                    onClick={(evt) => desktopWindow.close()}
                  ></button>
                  <button
                    className="zd-dot yellow"
                    onClick={(evt) => desktopWindow.toggleMinimize()}
                  ></button>
                  <button
                    className="zd-dot green"
                    onClick={(evt) => desktopWindow.toggleMaximize()}
                  ></button>
                </div>
              </Column>
              <Column style={{textAlign: 'center'}}>
                <div style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', display: 'inline-block', verticalAlign: 'middle' }}>
                  {
                    toolbar
                  }
                </div>
              </Column>
              <Column style={{textAlign: 'right'}}>
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
      </div>
    );
  }
};