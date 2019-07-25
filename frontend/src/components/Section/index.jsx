import React, { Component } from 'react';
import './style.css';

export default class Section extends Component {
  render() {
    const { children, className, ...propsRest } = this.props;

    return (
      <div
        { ...propsRest }
        className={`zd-section ${className ? className : ''}`}
      >
        { children }
      </div>
    )
  }
}