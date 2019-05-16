import React, {Component} from 'react';
import Menubar from '../Menubar';
import { Icon, /*Menu, Dropdown*/ } from 'antd';
import './style.css';

export default class Panel extends Component {
  render() {
    const {activeWindow, className, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        className={`zd-desktop-panel horizontal ${className ? className : ''}`}
      >
        <div className="zd-desktop-panel-column-left">
          <Menubar />
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