import React, {Component} from 'react';
import Moveable from '../Moveable';
import Gesture from '../Gesture';
import $ from 'jquery';
import './style.css';

export const RESIZABLE_DEFAULT_MIN_WIDTH = 300;
export const RESIZABLE_DEFAULT_MIN_HEIGHT = 300;

const RESIZABLE_TOUCH = false;
const RESIZABLE_MOUSE = true;

const RESIZE_DIRECTION_NORTH = 'n';
const RESIZE_DIRECTION_NORTHEAST = 'ne';
const RESIZE_DIRECTION_EAST = 'e';
const RESIZE_DIRECTION_SOUTHEAST = 'se';
const RESIZE_DIRECTION_SOUTH = 's';
const RESIZE_DIRECTION_SOUTHWEST = 'sw';
const RESIZE_DIRECTION_WEST = 'w';
const RESIZE_DIRECTION_NORTHWEST = 'nw';

export default class Resizable extends Component {
  _minWidth = 0;
  _minHeight = 0;
  
  _initialTouchX = 0;
  _initialTouchY = 0;

  _initialPosX = 0;
  _initialPosY = 0;

  _initialWidth = 0;
  _initialHeight = 0;

  componentDidMount() {
    this.$root = $(this.root);
    this.$main = $(this.main);

    const {minWidth, minHeight} = this.props;
    this.setMinWidthHeight(minWidth, minHeight);

    const {onBodyMount} = this.props;
    if (typeof onBodyMount === 'function') {
      onBodyMount(this.main);
    }
  }

  componentDidUpdate() {
    const {minWidth, minHeight} = this.props;
    this.setMinWidthHeight(minWidth, minHeight);
  }

  setMinWidthHeight(minWidth, minHeight) {
    this._minWidth = parseInt(minWidth) || RESIZABLE_DEFAULT_MIN_WIDTH;
    this._minHeight = parseInt(minHeight) || RESIZABLE_DEFAULT_MIN_HEIGHT;

    window.requestAnimationFrame(() => {
      this.$main.css({
        minWidth: this._minWidth,
        minHeight: this._minHeight
      });
    });
  }

  handleTouchStart = (evt) => {
    const {moveableComponent} = this.props;

    if (!moveableComponent) {
      console.error('No moveable component', this.props);
      return;
    }

    // console.debug('touch start', evt);

    const {x: initialPosX, y: initialPosY} = moveableComponent.getPosition();

    this._initialTouchX = evt.initial[0];
    this._initialTouchY = evt.initial[1];

    this._initialPosX = initialPosX;
    this._initialPosY = initialPosY;

    this._initialWidth = this.$main.innerWidth();
    this._initialHeight = this.$main.innerHeight();


    /*
    this.$main.css({
      backgroundColor: 'white'
    });
    */
  }

  // TODO: Use animation frame when resizing
  handleTouchMove = (direction, evt) => {
    // TODO: Ignore evt target if not original

    const {onResize, moveableComponent} = this.props;

    if (!moveableComponent) {
      console.error('No moveable component', this.props);
      return;
    }

    direction = direction.toLowerCase();

    // console.debug(`TODO: resize in direction: ${direction}`, evt);
    // const $root = $(this.root);
    const $main = $(this.main);

    const deltaX = evt.delta[0];
    const deltaY = evt.delta[1];

    let newWidth;
    let newHeight;

    /*
    console.debug({
      width,
      deltaX: evt.delta[0],
      height,
      deltaY: evt.delta[1]
    });
    */

    /*
    console.debug({
      deltaX,
      deltaY
    });
    */

    const {x: posX, y: posY} = moveableComponent.getPosition();
    
    // NOTE: Using bufferAnimateFrame here causes window jumpiness

    switch (direction) {
      case RESIZE_DIRECTION_NORTHWEST:
        newWidth = this._initialWidth - deltaX;
        newHeight = this._initialHeight - deltaY;

        $main.css({
          width: newWidth,
          height: newHeight
        });

        let newPos = {x: posX, y: posY};

        if (newWidth > this._minWidth) {
          // moveableComponent.moveTo(posX, this._initialPosY + deltaY);
          newPos.x = this._initialPosX + deltaX;
        }

        if (newHeight > this._minHeight) {
          // moveableComponent.moveTo(posX, this._initialPosY + deltaY);
          newPos.y = this.initalPosY + deltaY;
        }

        // TODO: Determine if new position is the same before trying to move
        moveableComponent.moveTo(newPos.x, newPos.y);
      break;

      case RESIZE_DIRECTION_NORTH:
        newHeight = this._initialHeight - deltaY;

        $main.css({
          height: newHeight
        });

        if (newHeight > this._minHeight) {
          moveableComponent.moveTo(posX, this._initialPosY + deltaY);
        }
      break;

      case RESIZE_DIRECTION_NORTHEAST:
        $main.css({
          height: this._initialHeight - deltaY,
          width: this._initialWidth + deltaX
        });

        if (deltaY < 0) {
          moveableComponent.moveTo(posX, this._initialPosY + deltaY);
        }
      break;

      case RESIZE_DIRECTION_EAST:
        $main.css({
          width: this._initialWidth + deltaX
        });
      break;

      case RESIZE_DIRECTION_SOUTHEAST:
        $main.css({
          width: this._initialWidth + deltaX,
          height: this._initialHeight + deltaY
        });
      break;

      case RESIZE_DIRECTION_SOUTH:
        $main.css({
          height: this._initialHeight + deltaY
        });
      break;

      case RESIZE_DIRECTION_SOUTHWEST:
        $main.css({
          width: this._initialWidth - deltaX,
          height: this._initialHeight + deltaY
        });

        // TODO: Move container left equiv to deltaX
      break;

      case RESIZE_DIRECTION_WEST:
        $main.css({
          width: this._initialWidth - deltaX
        });

        // TODO: Move container left equiv to deltaX
      break;

      default:
        throw new Error(`Unhandled resize direction: ${direction}`);
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
  };

  handleTouchEnd = (evt) => {
    // console.debug('touch stop', evt);
  }
  
  // TODO: Include ability to turn off Gesture layers
  render() {
    let {
        children,
        bodyClassName,
        className,
        onBodyMount,
        moveableComponent,
        minWidth,
        minHeight,
        style: contentStyle,
        onResize,
        ...propsRest
    } = this.props;

    return (
      <div
        {...propsRest}
        ref={ c => this.root = c }
        className={`zd-resizable ${className ? className : ''}`}
      >
        <div className="zd-resizable-table-row">
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control top-left"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTHWEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control top"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTH, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control top-right"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTHEAST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
        </div>
        <div className="zd-resizable-table-row">
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control left"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_WEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          {
            // Note: Main does not get zd-resizable-control class
          }
          <div
            className="zd-resizable-table-cell"
          >
            <div className={`ResizableBody ${bodyClassName ? bodyClassName : ''}`} style={contentStyle} ref={ c => this.main = c}>
              {
                children
              }
            </div>
          </div>
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control right"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_EAST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
        </div>
        <div className="zd-resizable-table-row">
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control bottom-left"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_SOUTHWEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control bottom"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_SOUTH, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="zd-resizable-table-cell zd-resizable-control bottom-right"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_SOUTHEAST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
        </div>
      </div>
    )
  }
}