import React, {Component} from 'react';
import Box3D from '../../Box3D';
import Window from '../../Window';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Shape3DTesterWindow extends Component {
  render() {
    return (
      <Window
        title="Shape3D Tester"
      >
        <div style={{textAlign: 'left'}}>
          <Dropdown isOpen={false}>
            <DropdownToggle caret>
              Box3D
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Shapes</DropdownItem>
              <DropdownItem>Box3D</DropdownItem>
              <DropdownItem>Carousel</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Box3D ref={ c => this._box3D = c} />
        </div>

        <div>
          <button onClick={ evt => this._box3D.showSide('Front') }>Front</button>
          <button onClick={ evt => this._box3D.showSide('Right') }>Right</button>
          <button onClick={ evt => this._box3D.showSide('Back') }>Back</button>
          <button onClick={ evt => this._box3D.showSide('Left') }>Left</button>
          <button onClick={ evt => this._box3D.showSide('Top') }>Top</button>
          <button onClick={ evt => this._box3D.showSide('Bottom') }>Bottom</button>
        </div>
      </Window>
    );
  }
}