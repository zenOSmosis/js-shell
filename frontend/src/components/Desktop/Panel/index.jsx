import React, {Component} from 'react';
// import Desktop from '../Desktop';
// import {WindowLifecycleEvents, EVT_WINDOW_DID_ACTIVATE, EVT_WINDOW_TITLE_DID_SET} from './../../../components/Desktop/Window';
// import Button from 'components/Button';
// import {Select, Option} from 'components/Select';
// import Window from '../Window';
import Menubar from '../Menubar';
import { Icon, /*Menu, Dropdown*/ } from 'antd';
import './style.css';


export default class Panel extends Component {
  state = {
    controlUIWindow: null,
    controlUIWindowTitle: null,
  };

  constructor(props) {
    super(props);

    /*
    if (!(this.props.desktop instanceof Desktop)) {
      throw new Error(`'desktop' property must be passed and must be an instance of Desktop`);
    }
    */

    /*
    this._masterLifecycleEvents = (() => {
      const masterLifecycleEvents = new WindowLifecycleEvents();
      masterLifecycleEvents.on(EVT_WINDOW_DID_ACTIVATE, (controlUIWindow) => {
        const controlUIWindowTitle = controlUIWindow.state.title;

        this.setState({
          controlUIWindow,
          controlUIWindowTitle
        });
      });

      masterLifecycleEvents.on(EVT_WINDOW_TITLE_DID_SET, (controlUIWindow) => {
        const controlUIWindowTitle = controlUIWindow.state.title;
  
        this.setState({
          controlUIWindowTitle
        });
      });

      return masterLifecycleEvents;
    })();
    */

  }

  render() {
    const {desktop, children, className, ...propsRest} = this.props;

    /*
    const menu = (
      <Menu>
        <Menu.Item key="2">Debug</Menu.Item>
        <Menu.Item key="3">Close</Menu.Item>
      </Menu>
    );
    */
    

    return (
      <div
        {...propsRest}
        className={`zd-desktop-panel horizontal ${className ? className : ''}`}
      >
        <div className="zd-desktop-panel-column-left">
          <div className="ApplicationTitle">
            <Menubar />
            {
              // TODO: Move this to Menubar

              /*
              this.state.controlUIWindowTitle &&
              <Dropdown overlay={menu} trigger={['click']}>
                <span style={{ userSelect: 'none' }}>{this.state.controlUIWindowTitle}</span>
              </Dropdown>
              */
            }
          </div>
        </div>

        <div className="zd-desktop-panel-column-right">
          <button style={{backgroundColor: 'transparent', padding: 0, color: '#fff', border: 0}}>
            <Icon type="menu-unfold" style={{padding: 0, margin: 0, verticalAlign: 'middle'}} />
          </button>
        </div>
      </div>
    );
  }
}