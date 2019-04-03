import React, {Component} from 'react';
import './style.css';
import $ from 'jquery';

export default class FullViewport extends Component {
  componentDidMount() {
    this._onPostRender();

    $(window).on('resize', this._onPostRender);
  }

  componentWillUnmount() {
    $(window).off('resize', this._onPostRender);
  }

  componentDidUpdate() {
    this._onPostRender();
  }

  _onPostRender = () => {
    const $base = $(this._base);

    const width = $(window).width();
    const height = $(window).height();

    $base.css({
      width,
      height
    });
  }

  render() {
    let {children, className, ...propsRest} = this.props;

    return (
        <div
          ref={ c => this._base = c }
          {...propsRest}
          className={
            `FullViewport
            ${className ? className : ''}
          `}
        >
          {children}
        </div>
    );
  }

  onCloseButtonClick = (evt) => {
    this.close();
  }
}