import React, { Component } from 'react';
import Moveable from '../Moveable';
import Gesture from '../Gesture';
import $ from 'jquery';
import './style.css';

export const RESIZABLE_DEFAULT_MIN_WIDTH = 300;
export const RESIZABLE_DEFAULT_MIN_HEIGHT = 300;

const RESIZABLE_TOUCH = true;
const RESIZABLE_MOUSE = true;

const RESIZE_DIRECTION_NORTH = 'n';
const RESIZE_DIRECTION_NORTHEAST = 'ne';
const RESIZE_DIRECTION_EAST = 'e';
const RESIZE_DIRECTION_SOUTHEAST = 'se';
const RESIZE_DIRECTION_SOUTH = 's';
const RESIZE_DIRECTION_SOUTHWEST = 'sw';
const RESIZE_DIRECTION_WEST = 'w';
const RESIZE_DIRECTION_NORTHWEST = 'nw';

export default class DragResizable extends Component {
  constructor(...args) {
    super(...args);

    this._initialTouchX = 0;
    this._initialTouchY = 0;

    this._initialPosX = 0;
    this._initialPosY = 0;

    this._initialWidth = 0;
    this._initialHeight = 0;

    this._moveableComponent = null;
  }

  componentDidMount() {
    this.$root = $(this.root);
    this.$main = $(this.main);

    this._setMinWidthHeight();

    const { onBodyMount } = this.props;
    if (typeof onBodyMount === 'function') {
      onBodyMount(this.main);
    }
  }

  componentDidUpdate() {
    if (!this._moveableComponent) {
      const { moveableComponent } = this.props;

      if (!(moveableComponent instanceof Moveable)) {
        throw new Error('moveableComponent is not an instance of Moveable');
      }

      this._moveableComponent = moveableComponent;

      const { x: initialPosX, y: initialPosY } = this._moveableComponent.getPosition();
      const initialWidth = this.$main.outerWidth();
      const initialHeight = this.$main.outerHeight();

      this._position = {
        x: initialPosX, y: initialPosY,
      }
      this._size = { height: initialHeight, width: initialWidth }
    }

    this._setMinWidthHeight();
  }

  _setMinWidthHeight() {
    let { minWidth, minHeight } = this.props;

    minWidth = parseInt(minWidth) || RESIZABLE_DEFAULT_MIN_WIDTH;
    minHeight = parseInt(minHeight) || RESIZABLE_DEFAULT_MIN_HEIGHT;

    window.requestAnimationFrame(() => {
      this.$main.css({
        minWidth,
        minHeight
      });
    });
  }

  _handleTouchMove(direction, evt) {
    // TODO: Ignore evt target if not original

    const { onResize } = this.props;

    if (!this._moveableComponent) {
      console.error('No moveable component', this.props);
      return;
    }

    let { minWidth, minHeight } = this.props;
    minWidth = minWidth || 0;
    minHeight = minHeight || 0;

    direction = direction.toLowerCase();

    // console.debug(`TODO: resize in direction: ${direction}`, evt);
    // const $root = $(this.root);
    const $main = $(this.main);

    const deltaX = evt.delta[0];
    const deltaY = evt.delta[1];

    let newWidth;
    let newHeight;

    const { x: posX, y: posY } = this._moveableComponent.getPosition();

    window.requestAnimationFrame(() => {
      switch (direction) {
        case RESIZE_DIRECTION_NORTHWEST:
          newWidth = this._initialWidth - deltaX;
          newHeight = this._initialHeight - deltaY;

          $main.css({
            width: newWidth,
            height: newHeight
          });

          let newPos = { x: posX, y: posY };

          if (newWidth >= minWidth) {
            newPos.x = this._initialPosX + deltaX;
          }

          if (newHeight >= minHeight) {
            newPos.y = this._initialPosY - Math.abs(deltaY);
          }

          // TODO: Determine if new position is the same before trying to move
          this._moveTo(newPos.x, newPos.y);
          break;

        case RESIZE_DIRECTION_NORTH:
          this._handleResizeNorth($main, posX, deltaY);
          break;

        case RESIZE_DIRECTION_NORTHEAST:
          this._handleResizeNorth($main, posX, deltaY);
          this._handleResizeEast($main, deltaX);
          break;

        case RESIZE_DIRECTION_EAST:
          this._handleResizeEast($main, deltaX);

          break;

        case RESIZE_DIRECTION_SOUTHEAST:
          this._handleResizeSouth($main, deltaY);
          this._handleResizeEast($main, deltaX);

          break;

        case RESIZE_DIRECTION_SOUTH:
          this._handleResizeSouth($main, deltaY);

          break;

        case RESIZE_DIRECTION_SOUTHWEST:
          this._handleResizeSouth($main, deltaY);
          this._handleResizeWest($main, deltaX);

          break;

        case RESIZE_DIRECTION_WEST:
          this._handleResizeWest($main, deltaX);

          break;

        default:
          console.error(`Unknown resize direction: ${direction}`);

          return;
      }

      const outerWidth = this.$root.outerWidth();;
      const outerHeight = this.$root.outerHeight();
      const mainWidth = this.$main.innerWidth();
      const mainHeight = this.$main.innerHeight();

      if (typeof onResize === 'function') {
        onResize({
          outerWidth,
          outerHeight,
          mainWidth,
          mainHeight
        })
      }
    });
  }

  _moveTo(posX, posY) {
    this._position.x = posX;
    this._position.y = posY;
    this._moveableComponent.moveTo(posX, posY, false);
  }

  _handleTouchStart(evt) {
    if (!this._moveableComponent) {
      console.error('No moveable component', this.props);
      return;
    }

    const { onResizeStart } = this.props;
    if (typeof onResizeStart === 'function') {
      onResizeStart(evt);
    }

    const { x: initialPosX, y: initialPosY } = this._moveableComponent.getPosition();

    this._initialTouchX = evt.initial[0];
    this._initialTouchY = evt.initial[1];

    this._initialPosX = initialPosX;
    this._initialPosY = initialPosY;

    this._initialWidth = this.$main.outerWidth();
    this._initialHeight = this.$main.outerHeight();
  }

  _handleResizeNorth($main, posX, deltaY) {
    const { minHeight } = this.props;
    const newHeight = this._initialHeight - deltaY;

    if (newHeight >= minHeight) {
      $main.css({
        height: newHeight
      });
      this._size.height = newHeight;

      this._moveTo(posX, this._initialPosY + deltaY);
    }
  }

  _handleResizeEast($main, deltaX) {
    const { minWidth } = this.props;
    const newWidth = this._initialWidth + deltaX;
    this._size.width = newWidth;

    if (newWidth >= minWidth) {
      $main.css({
        width: this._initialWidth + deltaX
      });
    }
  }

  _handleResizeSouth($main, deltaY) {
    const { minHeight } = this.props;
    const newHeight = this._initialHeight + deltaY;
    this._size.height = newHeight;

    if (newHeight >= minHeight) {
      $main.css({
        height: this._initialHeight + deltaY
      });
    }
  }

  _handleResizeWest($main, deltaX) {
    const { minWidth } = this.props;
    const newWidth = this._initialWidth - deltaX;
    this._size.width = newWidth;


    if (newWidth >= minWidth) {
      $main.css({
        width: newWidth
      });

      if (deltaX < 0) {
        this._moveTo(this._initialPosX - Math.abs(deltaX), this._initialPosY);
      } else {
        this._moveTo(this._initialPosX + Math.abs(deltaX), this._initialPosY);
      }
    }
  }

  _handleResizeMove() {
    const { onResizeMove } = this.props;
    if (typeof onResizeMove === 'function') {
      onResizeMove(this._moveableComponent.getPosition(), this._size);
    }
  }

  _handleTouchEnd(evt) {
    this._handleResizeMove();
    const { onResizeEnd } = this.props;
    if (typeof onResizeEnd === 'function') {
      onResizeEnd(evt);
    }
  }

  resize(width, height) {
    this.$main.css({
      width,
      height
    });
  }

  // TODO: Include ability to turn off Gesture layers
  render() {
    let {
      children,
      enable,
      bodyClassName,
      className,
      onBodyMount,
      moveableComponent,
      minWidth,
      minHeight,
      style: contentStyle,
      onResizeStart,
      onResize,
      onResizeEnd,
      onResizeMove,
      ...propsRest
    } = this.props;

    if (enable) {
      return (
        <div
          {...propsRest}
          ref={c => this.root = c}
          className={`zd-drag-resizable ${className ? className : ''}`}
        >
          <div className="zd-drag-resizable-table-row">
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control top-left"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_NORTHWEST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control top"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_NORTH, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control top-right"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_NORTHEAST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
          </div>
          <div className="zd-drag-resizable-table-row">
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control left"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_WEST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
            {
              // Note: Main does not get zd-drag-resizable-control class
            }
            <div
              className="zd-drag-resizable-table-cell"
            >
              <div
                className={`zd-drag-resizable-body ${bodyClassName ? bodyClassName : ''}`}
                style={contentStyle} ref={c => this.main = c}
              >
                {
                  children
                }
              </div>
            </div>
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control right"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_EAST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
          </div>
          <div className="zd-drag-resizable-table-row">
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control bottom-left"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_SOUTHWEST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control bottom"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_SOUTH, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
            <Gesture
              className="zd-drag-resizable-table-cell zd-drag-resizable-control bottom-right"
              touch={RESIZABLE_TOUCH}
              mouse={RESIZABLE_MOUSE}
              onMove={(evt) => this._handleTouchMove(RESIZE_DIRECTION_SOUTHEAST, evt)}
              onDown={(evt) => this._handleTouchStart(evt)}
              onUp={(evt) => this._handleTouchEnd(evt)}
            >
            </Gesture>
          </div>
        </div>
      )
    } else {
      return (
        <div
          {...propsRest}
          ref={c => this.root = c}
          className={`zd-drag-resizable ${className ? className : ''}`}
        >
          <div className="zd-drag-resizable-table-row">
            {
              // Note: Main does not get zd-drag-resizable-control class
            }
            <div
              className="zd-drag-resizable-table-cell"
            >
              <div
                className={`zd-drag-resizable-body ${bodyClassName ? bodyClassName : ''}`}
                style={contentStyle} ref={c => this.main = c}
              >
                {
                  children
                }
              </div>
            </div>
          </div>
        </div>
      )
    }

  }
}