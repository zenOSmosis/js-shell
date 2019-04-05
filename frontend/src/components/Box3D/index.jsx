// @see https://3dtransforms.desandro.com/cube

import React, {Component} from 'react';
import './style.css';

/*
const VALID_SIDES = [
  'Front',
  'Back',
  'Right',
  'Left',
  'Top',
  'Bottom'
];
*/

export default class Box3D extends Component {
  /*
  componentDidMount() {
    
    var radioGroup = document.querySelector('.radio-group');
    this._currentClass = '';

    const changeSide = () => {
      var checkedRadio = radioGroup.querySelector(':checked');
      
      this.showSide(checkedRadio.value);
    }
    // set initial side
    changeSide();

    radioGroup.addEventListener( 'change', changeSide );
  }
  */

  showSide(side) {
    side = side.toUpperCase();

    var showClass = `show-${side}`;
    if (this._currentClass) {
      this._box.classList.remove(this._currentClass);
    }
    this._box.classList.add(showClass);
    this._currentClass = showClass;
  }

  render() {
    return(
      <div style={{width: '100%', height: '100%'}}>
        <div className="Box3DScene">
          <div
            ref={ c => this._box = c }
            className="Box">
            <div className="Box__Face Box__Face--FRONT">Front</div>
            <div className="Box__Face Box__Face--BACK">Back</div>
            <div className="Box__Face Box__Face--RIGHT">Right</div>
            <div className="Box__Face Box__Face--LEFT">Left</div>
            <div className="Box__Face Box__Face--TOP">Top</div>
            <div className="Box__Face Box__Face--BOTTOM">Bottom</div>
          </div>
        </div>
      </div>
    );
  }
}