import React, { Component } from 'react';
// import { Gesture } from 'react-with-gesture';
import Gesture from '../Gesture';
import './style.css';

export default class Carousel3D extends Component {
  state = {
    totalCells: 150
  };

  componentDidMount() {
    this._parse();

    this.setOrientation();
  }

  rotateCarousel() {
    var angle = this._theta * this._selectedIndex * -1;
    this._carousel.style.transform = 'translateZ(' + -this._radius + 'px) ' +
      this._rotateFn + '(' + angle + 'deg)';
  }

  rotateForward() {
    this._selectedIndex++;
    this.rotateCarousel();
  }

  rotateBackward() {
    this._selectedIndex--;
    this.rotateCarousel();
  }

  updateCarousel() {
    this._theta = 360 / this.state.totalCells;
    const cellSize = this._isHorizontal ? this._cellWidth : this._cellHeight;
    this._radius = Math.round((cellSize / 2) / Math.tan(Math.PI / this.state.totalCells));

    if (!this._cells) {
      console.warn('Cells are not yet available');
      return;
    }

    for (var i = 0; i < this._cells.length; i++) {
      var cell = this._cells[i];
      if (i < this.state.totalCells) {
        // visible cell
        cell.style.opacity = 1;
        var cellAngle = this._theta * i;
        cell.style.transform = this._rotateFn + '(' + cellAngle + 'deg) translateZ(' + this._radius + 'px)';
      } else {
        // hidden cell
        cell.style.opacity = 0;
        cell.style.transform = 'none';
      }
    }

    this.rotateCarousel();
  }

  setOrientation(orientation = 'horizontal' || 'vertical') {
    this._isHorizontal = orientation.toLowerCase() === 'horizontal';
    this._rotateFn = this._isHorizontal ? 'rotateY' : 'rotateX';
    this.updateCarousel();
  }

  _parse() {
    if (!this._carousel) {
      console.warn('Carousel is not yet available');
      return;
    }

    this._cells = this._carousel.querySelectorAll('.Carousel__Cell');
    this._selectedIndex = 0;
    this._cellWidth = this._carousel.offsetWidth;
    this._cellHeight = this._carousel.offsetHeight;
    this._isHorizontal = true;
    this._rotateFn = this._isHorizontal ? 'rotateY' : 'rotateX';
    this._radius = 0;
    this._theta = 0;
  }

  onMoveGesture(evt) {
    // console.debug('move gesture', evt);

    if (evt.distance < 25) {
      return;
    }

    if (this._isHorizontal) {
      if (evt.direction[0] > 0) {
        // Move right
        this.rotateForward();
      } else if (evt.direction[0] < 0) {
        // Move right
        this.rotateBackward();
      }
    } else {
      if (evt.direction[1] < 0) {
        // Move right
        this.rotateForward();
      } else if (evt.direction[1] > 0) {
        // Move right
        this.rotateBackward();
      }
    }
  }

  render() {
    return (
      <Gesture
        touch={true}
        mouse={true}
        onMove={(evt) => this.onMoveGesture(evt)}
      >
       <div className="Carousel3DScene">
          <div ref={c => this._carousel = c} className="Carousel">
            {
              (() => {
                let cells = [];

                for (let i = 0; i < this.state.totalCells; i++) {
                  cells.push(
                    <div key={i} className="Carousel__Cell">{i + 1}</div>
                  );
                }

                return cells;
              })()
            }
          </div>
        </div>
      </Gesture>
    );
  }
}