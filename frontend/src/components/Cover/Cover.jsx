import React, {Component} from 'react';
import Full from '../Full';
import './style.css';

export default class Cover extends Component {
  render() {
    const {children, className, isVisible: isVisibleProp, ...propsRest} = this.props;
  
    const isVisible = (typeof isVisibleProp === 'undefined' ? true : (isVisibleProp ? true : false));
  
    return (
      <Full
        {...propsRest}
        className={`zd-cover ${!isVisible ? 'hidden' : ''} ${className ? className : ''}`}
      >
        {
          children
        }
      </Full>
    );
  }
}