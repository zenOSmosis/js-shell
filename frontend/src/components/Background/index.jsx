import React, {Component} from 'react';
import Cover from '../Cover';
import Full from '../Full';
import Image from '../Image';
import './style.css';

export default class Background extends Component {
  render() {
    let {children, src, className, ...propsRest} = this.props;

    return (
      <Full
        {...propsRest}
        className={`zd-background ${className ? className : ''}`}
      >
        <Cover className="zd-background-cover">
          <Image className="zd-background-image" alt="" src={src} />
        </Cover>
        
        <Cover>
          {
            children
          }
        </Cover>
      </Full>
    );
  }
}
