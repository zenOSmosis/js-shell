import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Full.module.css';

class Full extends Component {
  render() {
    const { children, className, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        className={classNames(styles['full'], className)}
      >
        {
          children
        }
      </div>
    );
  }
}

export default Full;