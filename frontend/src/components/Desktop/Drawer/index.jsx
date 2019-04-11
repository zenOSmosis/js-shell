import React, {Component} from 'react';

// @see https://ant.design/components/drawer/
export default class DesktopDrawer extends Component {
  render() {
    const {children, className, ...propsRest} = this.props;
    return (
      <div
        {...propsRest}
        className={`DesktopDrawer ${className ? className : ''}`}
      >
        {
          children
        }
      </div>
    );
  }
}