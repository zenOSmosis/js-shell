// @see https://3dtransforms.desandro.com/cube

import React, {Component} from 'react';
import bufferAnimateFrame from 'utils/bufferAnimateFrame';
import './style.css';

export const BOX3D_SIDE_FRONT = 'Front';
export const BOX3D_SIDE_RIGHT = 'Right';
export const BOX3D_SIDE_LEFT = 'Left';
export const BOX3D_SIDE_BACK = 'Back';
export const BOX3D_SIDE_TOP = 'Top';
export const BOX3D_SIDE_BOTTOM = 'Bottom';

export const BOX3D_SIDES = [
  BOX3D_SIDE_FRONT,
  BOX3D_SIDE_RIGHT,
  BOX3D_SIDE_LEFT,
  BOX3D_SIDE_BACK,
  BOX3D_SIDE_TOP,
  BOX3D_SIDE_BOTTOM
];

export default class Box3D extends Component {
  state = {
    // Default content for sides
    // Overridden by sideContent... props
    sideContentFront: BOX3D_SIDE_FRONT,
    sideContentRight: BOX3D_SIDE_RIGHT,
    sideContentLeft: BOX3D_SIDE_LEFT,
    sideContentBack: BOX3D_SIDE_BACK,
    sideContentTop: BOX3D_SIDE_TOP,
    sideContentBottom: BOX3D_SIDE_BOTTOM
  };

  _degX = 0;
  _degY = 0;
  _translateZ = 100;

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

  /*
  setPerspective(perspective = 100) {

  }
  */

  setPerspective(perspective = 200) {
    bufferAnimateFrame(() => {
      this._boxScene.style.perspective = `${parseInt(perspective)}px`;
    });
  }

  rotate(params = {degX: undefined, degY: undefined, translateZ: undefined}) {
    let {degX, degY, translateZ} = params;

    if (typeof degX === 'undefined') {
      degX = this._degX;
    }

    if (typeof degY === 'undefined') {
      degY = this._degY;
    }

    if (typeof translateZ === 'undefined') {
      translateZ = this._translateZ;
    }

    // Render
    bufferAnimateFrame(() => {
      this._box.style.transform = `rotateX(${degX}deg) rotateY(${degY}deg) translateZ(${translateZ}px)`;
    });

    this._degX = degX;
    this._degY = degY;
    this._translateZ = translateZ;
  }

  // TODO: Rename to setSideContent
  setFaceContent(side, content) {
    side = side.toLowerCase();

    const totalSides = BOX3D_SIDES.length
    
    for (let i = 0; i < totalSides; i++) {
      const testSide = BOX3D_SIDES[i];
      const testSideLowerCase = testSide.toLowerCase();

      console.debug({
        testSide,
        side,
        testSideLowerCase
      });

      if (side === testSideLowerCase) {
        const testPropName = `sideContent${testSide}`;

        if (typeof this.state[testPropName] === 'undefined') {
          throw new Error(`Box3D side does not exist with side: ${side}`);
        }
  
        let updatedState = {};
        updatedState[testPropName] = content;

        console.debug(updatedState);
  
        this.setState(updatedState);
  
        break;
      }
    }
  }

  // TODO: Build out alias function
  rotateToFace(face) {
    return this.showSide(face);
  }

  // TODO: Remove
  showSide(side) {
    side = side.toUpperCase();

    var showClass = `show-${side}`;
    if (this._currentClass) {
      this._box.classList.remove(this._currentClass);
    }
    this._box.classList.add(showClass);
    this._currentClass = showClass;
  }

  setOpacity(opacity) {
    window.requestAnimationFrame(() => {
      this._box.style.opacity = opacity / 100;
    });
  }

  render() {
    return(
      <div style={{width: '100%', height: '100%'}}>
        <div ref={ c => this._boxScene = c } className="Box3DScene">
          <div
            ref={ c => this._box = c }
            className="Box"
          >
            {
              // TODO: Create property option to dangerously render or not
            }
            <div className="Box__Face Box__Face--FRONT" dangerouslySetInnerHTML={{__html: this.state.sideContentFront}}></div>
            
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