// TODO: Rename to Moveable3D

import React, { Component } from 'react';

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

    this._root = null;

    this._rotationDegX = 0;
    this._rotationDegY = 0;
    this._rotationTranslateZ = 0;
  }

  componentDidMount() {
    const { initialX, initialY } = this.props;
    this.moveTo(initialX, initialY);

    // TODO: Move to CSS class
    this._root.style.transformStyle = 'preserve-3d';
  }

  componentWillUnmount() {
    this._root = null;
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
    this._posX = parseInt(posX, 10) || 0;
    this._posY = parseInt(posY, 10) || 0;

    // Prevent drag above boundary top
    this._posY = this._posY >= 0 ? this._posY : 0;

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
  _handleMove(posX, posY, rotation = {degX: undefined, degY: undefined, translateZ: undefined}) {
    if (!this._root) {
      return;
    }

    let {degX, degY, translateZ} = rotation;

    if (typeof degX === 'undefined') {
      degX = this._rotationDegX;
    }

    if (typeof degY === 'undefined') {
      degY = this._rotationDegY;
    }

    if (typeof translateZ === 'undefined') {
      translateZ = this._rotationTranslateZ;
    }

    const transform = `translate3d(${posX}px, ${posY}px, 0) rotateX(${degX}deg) rotateY(${degY}deg) translateZ(${translateZ}px)`;

    this._rotationDegX = degX;
    this._rotationDegY = degY;
    this._rotationTranslateZ = translateZ;

    // Set the CSS
    this._root.style.transform = transform;

    const { onMove } = this.props;
    if (typeof onMove === 'function') {
      onMove({ x: posX, y: posY });
    }
  }

  getPosition() {
    const x = parseInt(this._posX, 10);
    const y = parseInt(this._posY, 10);

    return {
      x,
      y
    };
  }

  setRotation(rotation = {degX: undefined, degY: undefined, translateZ: undefined}) {
    window.requestAnimationFrame(() => {
      this._handleMove(this._posX, this._posY, rotation);
    });
  }

  render() {
    const {
      children,
      initialX,
      initialY,
      onMove,
      ...propsRest
    } = this.props;

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