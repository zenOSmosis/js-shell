import React, {Component} from 'react';
import Moveable from '../Moveable';
import Gesture from '../Gesture';
import $ from 'jquery';
import './style.css';

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
  componentDidMount() {
    this.$root = $(this.root);
    this.$main = $(this.main);
  }

  handleTouchStart = (evt) => {
    console.debug('touch start', evt);

    this.initialX = evt.initial[0];
    this.initialY = evt.initial[1];
    this.initialWidth = this.$main.innerWidth();
    this.initialHeight = this.$main.innerHeight();

    /*
    this.$main.css({
      backgroundColor: 'white'
    });
    */
  }

  handleTouchEnd = (evt) => {
    console.debug('touch stop', evt);
  }

  handleTouchMove = (direction, evt) => {
    const {onResize, moveableComponent} = this.props;

    if (!(moveableComponent instanceof Moveable)) {
      throw new Error('moveableComponent must be a Moveable component');
    }

    direction = direction.toLowerCase();

    // console.debug(`TODO: resize in direction: ${direction}`, evt);
    const $root = $(this.root);
    const $main = $(this.main);

    const deltaX = evt.delta[0];
    const deltaY = evt.delta[1];

    /*
    console.debug({
      width,
      deltaX: evt.delta[0],
      height,
      deltaY: evt.delta[1]
    });
    */

    // TODO: Use animation frame when resizing

    switch (direction) {
      case RESIZE_DIRECTION_NORTHWEST:
        $main.css({
          width: this.initialWidth - deltaX,
          height: this.initialHeight - deltaY
        });

        // TODO: Move container left equiv to deltaX
        // TODO: Move container up equiv to deltaY
      break;

      case RESIZE_DIRECTION_NORTH:
        $main.css({
          height: this.initialHeight - deltaY
        });

        // TODO: Move container up equiv to deltaY
      break;

      case RESIZE_DIRECTION_NORTHEAST:
        $main.css({
          height: this.initialHeight - deltaY,
          width: this.initialWidth + deltaX
        });

        // TODO: Move container up equiv to deltaY
      break;

      case RESIZE_DIRECTION_EAST:
        $main.css({
          width: this.initialWidth + deltaX
        });
      break;

      case RESIZE_DIRECTION_SOUTHEAST:
        $main.css({
          width: this.initialWidth + deltaX,
          height: this.initialHeight + deltaY
        });
      break;

      case RESIZE_DIRECTION_SOUTH:
        $main.css({
          height: this.initialHeight + deltaY
        });
      break;

      case RESIZE_DIRECTION_SOUTHWEST:
        $main.css({
          width: this.initialWidth - deltaX,
          height: this.initialHeight + deltaY
        });

        // TODO: Move container left equiv to deltaX
      break;

      case RESIZE_DIRECTION_WEST:
        $main.css({
          width: this.initialWidth - deltaX
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
  
  render() {
    const {children, moveableComponent, onResize, ...propsRest} = this.props;

    return (
      <div
        ref={ c => this.root = c }
        {...propsRest}
        className="Resizable"
      >
        <div className="TableRow">
          <Gesture
            className="TableCell RSControl TopLeft"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTHWEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="TableCell RSControl Top"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTH, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="TableCell RSControl TopRight"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_NORTHEAST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
        </div>
        <div className="TableRow">
          <Gesture
            className="TableCell RSControl Left"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_WEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          {
            // Note: Main does not get RSControl class
          }
          <div
            className="TableCell"
          >
            <div style={{width: '100%', height: '100%'}} ref={ c => this.main = c}>
              {
                children
              }
            </div>
          </div>
          <Gesture
            className="TableCell RSControl Right"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_EAST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
        </div>
        <div className="TableRow">
          <Gesture
            className="TableCell RSControl BottomLeft"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_SOUTHWEST, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="TableCell RSControl Bottom"
            touch={RESIZABLE_TOUCH}
            mouse={RESIZABLE_MOUSE}
            onMove={(evt) => this.handleTouchMove(RESIZE_DIRECTION_SOUTH, evt)}
            onDown={(evt) => this.handleTouchStart(evt)}
            onUp={(evt) => this.handleTouchEnd(evt)}
          >
          </Gesture>
          <Gesture
            className="TableCell RSControl BottomRight"
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