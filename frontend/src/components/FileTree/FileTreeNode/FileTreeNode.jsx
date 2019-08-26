import React, { Component } from 'react';
import classNames from 'classnames';
import style from './FileTreeNode.module.css';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

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
        <div style={{display: 'inline-block', marginRight: 4}}>
          {
            isDir && (!isToggled ? <FaChevronRight /> : <FaChevronDown />)
          }
        </div>
        
        {name}
      </div>
    );
  }
}

export default FileTreeNode;