import React, {Component} from 'react';
import Cover from '../Cover';
import './style.css';

export default class Background extends Component {
  render() {
    let {children, src, className, style, ...propsRest} = this.props;

    style = Object.assign({}, style, {
      backgroundImage: `url("${src}")`
    });

    return (
      <div
        {...propsRest}
        className={`Background ${className ? className : ''}`}
        style={style}
      >
        <Cover>
          {
            children
          }
        </Cover>
      </div>
    );
  }
}
