import React, { Component } from 'react';
import classNames from 'classnames';
import style from './FileTreeNode.module.css';

class FileTreeNode extends Component {
  render() {
    const {
      className: propsClassName,
      isDir,
      isToggled,
      name,
      ...propsRest
    } = this.props;

    const className = classNames([style['file-tree-node'], propsClassName]);

    return (
      <div
        {...propsRest}
        className={className}
      >
        { isDir && (isToggled && '/' || '-') }
        {name}
      </div>
    );
  }
}

export default FileTreeNode;