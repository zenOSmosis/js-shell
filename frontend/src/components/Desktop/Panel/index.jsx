import React, {Component} from 'react';
import Desktop from '../Desktop';
import {WindowLifecycleEvents, EVT_WINDOW_DID_ACTIVATE, EVT_WINDOW_TITLE_DID_SET} from './../../../components/Desktop/Window';
import './style.css';
import {Select, Option} from '../../Select';
import Window from '../Window';
import Button from '../../Button';
import Menubar from '../Menubar';
import {Icon, Menu, Dropdown} from 'antd';


export default class Panel extends Component {
  state = {
    controlUIWindow: null,
    controlUIWindowTitle: null,
  };

  constructor(props) {
    super(props);

    if (!(this.props.desktop instanceof Desktop)) {
      throw new Error(`'desktop' property must be passed and must be an instance of Desktop`);
    }

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


  }

  render() {
    const {desktop, children, className, ...propsRest} = this.props;

    const menu = (
      <Menu>
        <Menu.Item key="2">Debug</Menu.Item>
        <Menu.Item key="3">Close</Menu.Item>
      </Menu>
    );
    

    return (
      <div
        {...propsRest}
        className={`DesktopPanel Horizontal ${className ? className : ''}`}
      >
        <div className="DesktopPanelColumnLeft">
          <div className="ApplicationTitle">
            <Menubar />
            {
              this.state.controlUIWindowTitle &&
              <Dropdown overlay={menu} trigger={['click']}>
                <span style={{ userSelect: 'none' }}>{this.state.controlUIWindowTitle}</span>
              </Dropdown>
            }
          </div>
        </div>

        <div className="DesktopPanelColumnCenter">

        </div>

        <div className="DesktopPanelColumnRight">
          <button style={{backgroundColor: 'transparent', padding: 0, color: '#fff', border: 0}}>
            <Icon type="menu-unfold" style={{padding: 0, margin: 0, verticalAlign: 'middle'}} />
          </button>
        </div>
      </div>
    );
  }
}