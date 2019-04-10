import Desktop from '../Desktop';
import React, { Component } from 'react';
import Image from '../../Image';
import { Tooltip } from 'antd';
// import AppMenuWindow from '../windows/AppMenuWindow';
import AppMenuWindow from '../windows/HelloWorldWindow';
import Files from '../windows/Files';
import Code from '../windows/Code';
import WindowManager from '../windows/WindowManager';
import './style.css';

export default class Dock extends Component {
  componentDidMount() {
    const { desktop } = this.props;
    if (!(desktop instanceof Desktop)) {
      throw new Error('desktop must be an instance of Desktop');
    }

    this._desktop = desktop;
  }

  render() {
    const { className, desktop, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        className={`DesktopDock ${className ? className : ''}`}
      >
        <div className="DesktopDockItems">
          <Tooltip autoAdjustOverflow={true} title="app 1">
            <button
              onClick={evt => desktop.createWindow(<AppMenuWindow />)}
              style={{borderBottom: '5px blue solid'}}
            >
              <Image src="http://localhost:3001/icons?iconName=rocket-launch/rocket-launch.svg" height="40px" style={{ paddingLeft: 5, paddingRight: 5 }} />
            </button>
          </Tooltip>

          <Tooltip autoAdjustOverflow={true} title="app 2">
            <button
              onClick={evt => desktop.createWindow(<Files />)}
              style={{borderBottom: '5px transparent solid'}}
            >
              <Image src="http://localhost:3001/icons?iconName=folder/folder.svg" height="40px" style={{ paddingLeft: 5, paddingRight: 5 }} />
            </button>
          </Tooltip>

          <Tooltip autoAdjustOverflow={true} title="app 3">
            <button
              onClick={evt => desktop.createSystemInformationWindow()}
              style={{borderBottom: '5px transparent solid'}}
            >
              <Image src="http://localhost:3001/icons?iconName=control-panel/control-panel.svg" height="40px" style={{ paddingLeft: 5, paddingRight: 5 }} />
            </button>
          </Tooltip>

          <Tooltip autoAdjustOverflow={true} title="app 4">
            <button
              onClick={evt => desktop.createWindow(<Code />)}
              style={{borderBottom: '5px transparent solid'}}
            >
              <Image src="http://localhost:3001/icons?iconName=code/code.svg" height="40px" style={{ paddingLeft: 5, paddingRight: 5 }} />
            </button>
          </Tooltip>

          <Tooltip autoAdjustOverflow={true} title="app 5">
            <button
              onClick={evt => desktop.createWindow(<WindowManager />)}
              style={{borderBottom: '5px transparent solid'}}
            >
              <Image src="http://localhost:3001/icons?iconName=windows/windows.svg" height="40px" style={{ paddingLeft: 5, paddingRight: 5 }} />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}