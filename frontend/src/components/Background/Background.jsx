import React, {Component} from 'react';
import Cover from '../Cover';
import Full from '../Full';
import Image from '../Image';
import classNames from 'classnames';
import styles from './Background.module.css';

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
        className={classNames(styles['background'], className)}
      >
        <Cover className={styles['cover']}>
          <Image
            className={styles['image']}
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