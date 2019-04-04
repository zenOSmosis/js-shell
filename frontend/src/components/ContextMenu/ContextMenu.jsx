import React, {Component} from 'react';
import './style.css';

export default class ContextMenu extends Component {
  render() {
    const {children, className, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        className={`ContextMenu ${className ? className : ''}`}
        onContextMenu={ (evt) => console.debug('context menu intercept', evt) }
      >
        {
          children
        }
      </div>
    )
  }
}