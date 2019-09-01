/**
 * IMPORTANT! SocketFSFileTree is directly attached to socketFS.
 */

import React, { Component } from 'react';
import SocketFSFileTreeNodeComponent from './SocketFSFileTreeNode';
import {
  absorb,
  fetchDirTreeData,
  findSocketFSFileTreeNodeWithPath
} from './SocketFSFileTree.utils';
import Scrollable from '../Scrollable';
import { Treebeard } from 'react-treebeard';
// import decorators from 'react-treebeard/lib/components/decorators';
import './SocketFSFileTree.typedefs';
import PropTypes from 'prop-types';

const decorators = {
  Loading: (props) => {
    return (
      <div style={props.style}>
        loading...
      </div>
    );
  },

  /*
  Toggle: (props) => {
    console.debug('toggled?', props.isToggled);

    return (
      <div style={props.style}>
        {
          <svg height={props.height} width={props.width}>
            // Vector Toggle Here
        </svg>
        }
      </div>
    );
  },
  */

  /*
  Header: (props) => {
    return (
      <div style={props.style}>
        {props.node && props.node.name}
      </div>
    );
  },
  */

  Container: (props) => {
    const { node } = props;
    const { isDir, name, toggled: isToggled } = node;

    return (
      <div
        style={{ width: '100%' }}
        onClick={props.onClick}
      >
        {
          /*
          <props.decorators.Header />
          */
        }
        {
          /*
          <props.decorators.Toggle isToggled={props.node.toggled} />
          */
        }
        <SocketFSFileTreeNodeComponent
          name={name}
          isDir={isDir}
          isToggled={isToggled}
          onClick={ evt => console.debug(node) }
        />
      </div>
    );
  }
};

class SocketFSFileTree extends Component {
  static propTypes = {
    rootDirectory: PropTypes.string,
    onFileOpenRequest: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      // TODO: Document this type
      treeData: {}
    };
  }

  async componentDidMount() {
    try {
      const rootDirectory = this.props.rootDirectory || '/';

      const treeData = await fetchDirTreeData(rootDirectory);

      this.setState({
        treeData
      });
    } catch (exc) {
      throw exc;
    }
  }

  async handleTreebeardToggle(fileTreeNode) {
    const { path, isFile } = fileTreeNode;

    if (isFile) {
      const { onFileOpenRequest } = this.props;
      if (typeof onFileOpenRequest === 'function') {
        onFileOpenRequest(path);
      }
    } else {
      this.toggleSocketFSFileTreeNodeWithPath(path);
    }
  }

  async toggleSocketFSFileTreeNodeWithPath(path) {
    try {
      const { treeData } = this.state;
      let { walkPath, fileTreeNode } = findSocketFSFileTreeNodeWithPath(treeData, path);

      if (!fileTreeNode) {
        console.error('Could not locate fileTreeNode');
        return;
      }

      // Detect if already open, or closed, and handle accordingly
      if (!fileTreeNode.toggled) {
        await this.expandSocketFSFileTreeNode(fileTreeNode, walkPath);
      } else {
        await this.collapseSocketFSFileTreeNode(fileTreeNode, walkPath);
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Grafts the given tree node into the file tree, setting the updated state.
   * 
   * @param {SocketFSFileTreeNode} fileTreeNode 
   * @param {string} walkPath 
   */
  graftSocketFSFileTreeNode(fileTreeNode, walkPath) {
    const { treeData } = this.state;

    // Absorb fileTreeNode data to mute compiler warnings with eval'd code
    absorb(fileTreeNode);

    // Graft in the new fileTreeNode data
    // eslint-disable-next-line 
    eval(`treeData${walkPath} = fileTreeNode`);

    this.setState({
      treeData
    });
  }

  async expandSocketFSFileTreeNode(fileTreeNode, walkPath) {
    try {
      const { path } = fileTreeNode;

      fileTreeNode = await fetchDirTreeData(path);
      fileTreeNode.toggled = true;

      this.graftSocketFSFileTreeNode(fileTreeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
  }

  async collapseSocketFSFileTreeNode(fileTreeNode, walkPath) {
    try {
      fileTreeNode.toggled = false;

      this.graftSocketFSFileTreeNode(fileTreeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { treeData } = this.state;

    return (
      <Scrollable style={{ textAlign: 'left' }}>
        <Treebeard
          decorators={decorators}
          data={treeData}
          onToggle={fileTreeNode => this.handleTreebeardToggle(fileTreeNode)}
        />
      </Scrollable>
    )
  }
}

export default SocketFSFileTree;