// TODO: Implement https://blueprintjs.com/docs/#core/components/hotkeys

import React, { Component } from 'react';
import Box3D from '../../../Box3D';
import Carousel3D from '../../../Carousel3D';
import Window from '../../Window';
import { Button, ButtonGroup } from '../../../ButtonGroup';
import { Select, Option } from '../../../Select';
import Cover from '../../../Cover';
import {Icon} from 'antd';

// import {Slider} from '../../../Slider';

class Box3DShapeTester extends Component {
  render() {
    return (
      <div>
        <div style={{ padding: '1rem' }}>
          <ButtonGroup>
            <Button onClick={evt => this._box3D.showSide('Front')}>Front</Button>
            <Button onClick={evt => this._box3D.showSide('Right')}>Right</Button>
            <Button onClick={evt => this._box3D.showSide('Back')}>Back</Button>
            <Button onClick={evt => this._box3D.showSide('Left')}>Left</Button>
            <Button onClick={evt => this._box3D.showSide('Top')}>Top</Button>
            <Button onClick={evt => this._box3D.showSide('Bottom')}>Bottom</Button>
          </ButtonGroup>
        </div>

        {
          /*
          <div style={{height: 200, display: 'inline-block'}}>
            <Slider vertical />
          </div>
          */
        }

        <div style={{ display: 'inline-block' }}>
          <Box3D key="box3d" ref={c => this._box3D = c} />
        </div>
      </div>
    )
  }
}

class Carousel3DShapeTester extends Component {
  render() {
    return (
      <div>

        <Cover style={{paddingTop: '2rem'}}>
            <Carousel3D key="carousel3d" ref={c => this._carousel3D = c} />
        </Cover>

          {
            /*
              <div style={{position: 'absolute', width: '100%', top: 0, paddingTop: '1rem'}}>
                <ButtonGroup>
                  <Button onClick={evt => this._carousel3D.rotateBackward()}>&lt;&lt;</Button>
                  <Button onClick={evt => this._carousel3D.rotateForward()}>&gt;&gt;</Button>
                </ButtonGroup>
              </div>
            */
          }
         
          <div style={{position: 'absolute', width: '100%', bottom: 0, paddingBottom: '1rem'}}>
            <ButtonGroup>
              <Button onClick={evt => this._carousel3D.setOrientation('horizontal')}>Horizontal</Button>
              <Button onClick={evt => this._carousel3D.setOrientation('vertical')}>Vertical</Button>
            </ButtonGroup>
          </div>

        {
          /*
          <div style={{height: 200, display: 'inline-block'}}>
            <Slider vertical />
          </div>
          */
        }
      </div>
    )
  }
}

export default class Shape3DTesterWindow extends Component {
  state = {
    selectedShape: 'box3d'
  };

  render() {
    return (
      <Window
        title="Shape3D Tester"
        toolbar={
          <div>
            <Select
              defaultValue={this.state.selectedShape}
              onChange={(selectedShape) => this.setState({ selectedShape })}
            >
              <Option value="box3d" selected style={{ zIndex: 2000 }}>Box3D</Option>
              <Option value="carousel3d">Carousel</Option>
            </Select>

            &nbsp; Shape Tester

            <div style={{position: 'absolute', right: 4, top: 4}}>
              <ButtonGroup>
                <Button style={{paddingTop: 0}}><Icon style={{fontSize: '1rem'}} type="caret-left" theme="filled" /></Button>
                <Button style={{paddingTop: 0}}><Icon style={{fontSize: '1rem'}} type="caret-right" theme="filled" /></Button>
              </ButtonGroup>
            </div>
          </div>
        }
      >
        {
          this.state.selectedShape === 'box3d' &&
          <Box3DShapeTester />
        }

        {
          this.state.selectedShape === 'carousel3d' &&
          <Carousel3DShapeTester />
        }
      </Window>
    );
  }
}