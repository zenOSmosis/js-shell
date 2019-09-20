import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './SaveForLater.module.css';
import classNames from 'classnames';

class SaveForLater extends Component {
  _mediaPlayerLinkedState = null;

  componentDidUpdate() {
    if (!this._mediaPlayerLinkedState) {
      const { mediaPlayerLinkedState } = this.props;

      this._mediaPlayerLinkedState = mediaPlayerLinkedState;
    }
  }

  _handleClick(evt) {
    evt.stopPropagation();

    if (this._mediaPlayerLinkedState) {
      this._mediaPlayerLinkedState.addPlayListItem({
        foo: 'bar'
      });
    }
  }

  render() {
    const {
      isSaved,
      className: propsClassName,
      ...propsRest
    } = this.props;
  
    const className = classNames(
      styles['save-for-later'],
      (isSaved ? styles['saved'] : null),
      propsClassName
    );

    return (
      <button
        {...propsRest}
        className={className}
        onClick={evt => this._handleClick(evt)}
      >
        <Icon
          type="file-add"
          theme="filled"
          className={styles['icon']}
        />
  
        <div className={styles['text']}>Save for Later</div>
      </button>
    );
  }
};

export default SaveForLater;