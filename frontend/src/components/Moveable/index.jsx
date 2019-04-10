import React, {Component} from 'react';
import $ from 'jquery';

export default class Moveable extends Component {
  componentDidMount() {
    this._$root = $(this._root);

    const {posX, posY} = this.props;
    this.moveTo(posX, posY);
  }

  componentDidUpdate() {
    const {posX, posY} = this.props;
    this.moveTo(posX, posY);
  }

  moveTo(posX, posY) {
    window.requestAnimationFrame(() => {
      this._$root.css({
        transform: `translate3d(${parseInt(posX)}px, ${parseInt(posY)}px, 0)`
      });
    });
  }

  render() {
    const {children, posX, posY, ...propsRest} = this.props;

    return (
      <div
        ref={ c => this._root = c }
        {...propsRest}
      >
        {
          children
        }
      </div>
    );
  }
}