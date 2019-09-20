import React, {Component} from 'react';
import Cover from '../Cover';
import Full from '../Full';
import Image from '../Image';
import classNames from 'classnames';
import style from './Background.module.css';

export default class Background extends Component {
  render() {
    const {
      children,
      src,
      className,
      ...propsRest
    } = this.props;

    return (
      <Full
        {...propsRest}
        className={classNames(style['background'], className)}
      >
        <Cover className={style['cover']}>
          <Image
            className={style['image']}
            src={src}
          />
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