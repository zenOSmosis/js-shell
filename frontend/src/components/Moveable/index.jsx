import React, { Component } from 'react';
import $ from 'jquery';

/**
 * Note, this component only contains functionality relating to moving of the
 * rendered DOM element.  It does not contain Gesture functionality.
 * 
 * @extends Component
 */
export default class Moveable extends Component {
  constructor(...args) {
    super(...args);

    this._posX = 0;
    this._posY = 0;
  }

  componentDidMount() {
    this._$root = $(this._root);

    const { initialX, initialY } = this.props;
    this.moveTo(initialX, initialY);
  }

  /**
   * Moves the element to the given coordinates.
   * 
   * @param {number} posX 
   * @param {number} posY 
   * @param {boolean} isUsingHA [default = true] Whether or not to use animation
   * frame acceleration on this method call. 
   */
  moveTo(posX, posY, isUsingHA = true) {
    this._posX = parseInt(posX) || 0;
    this._posY = parseInt(posY) || 0;
    if (isUsingHA) {
      // Run the move handler using hardware acceleration
      window.requestAnimationFrame(() => {
        this._handleMove(this._posX, this._posY);
      });
    } else {
      this._handleMove(this._posX, this._posY);
    }
  }

  /**
   * Directly handles move functionality.
   * 
   * Important! Doesn't use requestAnimationFrame() internally. This
   * functionality should be handled directly in the caller.
   * 
   * @param {number} posX 
   * @param {number} posY 
   */
  _handleMove(posX, posY) {
    this._$root.css({
      transform: `translate3d(${posX}px, ${posY}px, 0)`
    });
    const { onMove } = this.props;
    if (typeof onMove === 'function') {
      onMove({x: posX, y: posY});
    }
  }

  getPosition() {
    const x = parseInt(this._posX);
    const y = parseInt(this._posY);

    return {
      x,
      y
    };
  }

  render() {
    const { children, initialX, initialY, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        ref={c => this._root = c}
      >
        {
          children
        }
      </div>
    );
  }
}