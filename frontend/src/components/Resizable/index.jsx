import React, {Component} from 'react';
import 'style.css';

export default class Resizable extends Component {
  render() {
    const {children, className} = this.props;

    return (
      <div
        className={`Resizable ${className ? className : ''}`}
      >
        {
          children
        }
      </div>
    );
  }
}