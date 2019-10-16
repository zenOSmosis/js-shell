import React, { Component } from 'react';
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
          {
            typeof src === 'string' &&
            <Image
              className={styles['image']}
              src={src}
            />
          }
          {
            (typeof src === 'object' || typeof src === 'function') &&
            (() => {
              const DisplayComponent = src;

              return (
                <DisplayComponent />
              );
            })()
          }
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