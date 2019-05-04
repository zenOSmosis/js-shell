import React, {Component} from 'react';
import Cover from '../Cover';
import Full from '../Full';
import './style.css';

export default class Background extends Component {
  render() {
    let {children, src, className, style, ...propsRest} = this.props;

    if (src) {
      style = Object.assign({}, style, {
        backgroundImage: `url("${src}")`
      });
    }

    return (
      <Full
        {...propsRest}
        className={`zd-background ${className ? className : ''}`}
        style={style}
      >
        <Cover>
          {
            children
          }
        </Cover>
      </Full>
    );
  }
}
