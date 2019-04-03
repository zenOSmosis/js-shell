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
            class="Box">
            <div class="Box__Face Box__Face--Front">Front</div>
            <div class="Box__Face Box__Face--Back">Back</div>
            <div class="Box__Face Box__Face--Right">Right</div>
            <div class="Box__Face Box__Face--Left">Left</div>
            <div class="Box__Face Box__Face--Top">Top</div>
            <div class="Box__Face Box__Face--Bottom">Bottom</div>
          </div>
        </div>
        {
          /*
           <p style={{whiteSpace: 'nowrap'}} class="radio-group">
            <label>
              <input type="radio" name="rotate-cube-side" value="Front" checked /> Front
            </label>
            <label>
              <input type="radio" name="rotate-cube-side" value="Right" /> Right
            </label>
            <label>
              <input type="radio" name="rotate-cube-side" value="Back" /> Back
            </label>
            <label>
              <input type="radio" name="rotate-cube-side" value="Left" /> Left
            </label>
            <label>
              <input type="radio" name="rotate-cube-side" value="Top" /> Top
            </label>
            <label>
              <input type="radio" name="rotate-cube-side" value="Bottom" />Bottom
            </label>
          </p>
          */
        }

      </div>
    );
  }
}