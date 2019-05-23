import React, {Component} from 'react';
import $ from 'jquery';

export default class Moveable extends Component {
  _posX = 0;
  _posY = 0;

  componentDidMount() {
    this._$root = $(this._root);

    const {initialX, initialY} = this.props;
    this.moveTo(initialX, initialY);
  }

  moveTo(posX, posY) {
    this._posX = parseInt(posX) || 0;
    this._posY = parseInt(posY) || 0;

    window.requestAnimationFrame(() => {
      this._$root.css({
        transform: `translate3d(${this._posX}px, ${this._posY}px, 0)`
      });
    });
  }

  getPosition() {
    const x = parseInt(this._posX);
    const y = parseInt(this._posY);

    // console.debug('getting position', {x, y});

    return {
      x,
      y
    };
  }

  render() {
    const {children, initialX, initialY, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        ref={ c => this._root = c }
      >
        {
          children
        }
      </div>
    );
  }
}