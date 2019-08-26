import React, { Component } from 'react';

class FileTreeNode extends Component {
  render() {
    const { name, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        style={{ display: 'inline-block' }}
      >
        {name}
      </div>
    );
  }
}

export default FileTreeNode;