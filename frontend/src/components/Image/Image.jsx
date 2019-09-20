import React, { Component } from 'react';
import classNames from 'classnames';
import style from './Image.module.scss';
import PropTypes from 'prop-types';

class Image extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired
  };

  state = {
    isLoaded: false
  };

  render() {
    let {
      className,
      alt,
      title,
      src,
      ...propsRest
    } = this.props;

    alt = alt || '';
    title = title || alt;

    const { isLoaded } = this.state;

    return (
      <img
        {...propsRest}
        className={classNames(style['image'], (isLoaded ? style['loaded'] : null), className)}
        onLoad={evt => this.setState({ isLoaded: true })}
        alt={alt}
        title={title}
        src={src}
      />
    );
  }
}

export default Image;