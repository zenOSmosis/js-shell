import React, { Component } from 'react';
import classNames from 'classnames';
import style from './Full.module.css';

class Full extends Component {
  render() {
    const { children, className, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        className={classNames(style['full'], className)}
      >
        {
          children
        }
      </div>
    );
  }
}

export default Full;