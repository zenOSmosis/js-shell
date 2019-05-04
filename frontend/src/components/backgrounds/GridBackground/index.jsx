import React, {Component} from 'react';
import Background from '../../Background';
import './style.css';

// @see https://leaverou.github.io/css3patterns/#blueprint-grid
export default class GridBackground extends Component {
  render() {
    let {children, className, style, ...propsRest} = this.props;

    return (
      <Background
        {...propsRest}
        className={`zd-grid-background ${className ? className : ''}`}
        style={style}
      >
        {
          children
        }
      </Background>
    );
  }
}
