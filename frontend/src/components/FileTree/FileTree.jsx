// Note, out of simplicity, this FileTree is directly attached to socketFS

import React, { Component } from 'react';
import FileTreeNodeComponent from './FileTreeNode';
import Scrollable from '../Scrollable';
import { Treebeard } from 'react-treebeard';
// import decorators from 'react-treebeard/lib/components/decorators';
import { dirDetail } from 'utils/socketFS';
import './FileTree.typedefs';
import PropTypes from 'prop-types';

const _absorb = () => null;

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
        <FileTreeNodeComponent
          name={name}
          isDir={isDir}
          isToggled={isToggled}
          onClick={ evt => console.debug(node) }
        />
      </div>
    );
  }
};

class FileTree extends Component {
  static propTypes = {
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
      // TODO: Fetch root path / directory separator (don't hardcode)
      const treeData = await this.fetchDirTreeData('/');

      this.setState({
        treeData
      });
    } catch (exc) {
      throw exc;
    }
  }

  async fetchDirTreeData(path) {
    try {
      const rawDirDetail = await dirDetail(path);

      const branchData = {
        isDir: rawDirDetail.isDir,
        name: rawDirDetail.base,
        path: rawDirDetail.path, // Normalized path
        toggled: true,
        children: (() => {
          if (!rawDirDetail.children) {
            return undefined;
          }

          return rawDirDetail.children.filter(child => {
            // Skip error nodes
            if (child.error) {
              console.warn('Skipping errored child', child);
            }
            return !child.error
          }).map(child => {
            const { base: childBase, isDir, ...childRest } = child;

            return {
              // Sub-children don't need to render values at this branch level,
              // and setting undefined as the value removes the dropdown toggle
              children: (isDir ? [] : undefined),
              
              ...childRest,
              isDir,
              name: childBase,
              toggled: false
            }
          });
        })()
      };

      return branchData;
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @param {string} path
   * @return {FileTreeNodeWithWalkPath} 
   */
  findFileTreeNodeWithPath(path) {
    const { treeData } = this.state;

    // Absorb fileTreeNode data to mute compiler warnings with eval'd code
    _absorb(treeData);

    const SEARCH_KEY_PATH = 'path';
    const SEARCH_KEY_CHILDREN = 'children';

    // Recursively walks the path in order to find the searched tree node
    const r_find = (path, walkPath = '') => {
      // eslint-disable-next-line 
      const subKeys = Object.keys(eval(`treeData${walkPath}`));
      for (const key of subKeys) {
        switch (key) {
          case SEARCH_KEY_PATH:
            // eslint-disable-next-line 
            const treeDataPath = eval(`treeData${walkPath}[key]`);

            if (path === treeDataPath) {
              return walkPath;
            }
            break;

          case SEARCH_KEY_CHILDREN:
            // eslint-disable-next-line 
            const treeDataChildren = eval(`treeData${walkPath}[key]`);

            if (Array.isArray(treeDataChildren)) {
              const lenTreeDataChildren = treeDataChildren.length;

              for (let i = 0; i < lenTreeDataChildren; i++) {
                const child = treeDataChildren[i];

                const { path: childPath } = child;

                if (path === childPath) {
                  // Add the current path to the walkPath
                  walkPath = `${walkPath}.${SEARCH_KEY_CHILDREN}[${i}]`;

                  return walkPath;
                } else {
                  // Determine if the current child path is within our search path
                  if (path.includes(childPath)) {
                    // Add the current path to the walkPath
                    walkPath = `${walkPath}.${SEARCH_KEY_CHILDREN}[${i}]`;

                    return r_find(path, walkPath);
                  }
                }
              }
            }
            break;

          default:
            // Ignore
            break;
        }
      }
    };

    let walkPath = r_find(path);

    if (!walkPath) {
      console.warn('Could not obtain walk path for path', path);

      walkPath = '';
    }

    // if (walkPath) {
    // eslint-disable-next-line 
    const fileTreeNode = eval(`this.state.treeData${walkPath}`);

    return {
      walkPath,
      fileTreeNode
    };
    // }
  }

  async handleTreebeardToggle(fileTreeNode) {
    const { path, isFile } = fileTreeNode;

    if (isFile) {
      const { onFileOpenRequest } = this.props;
      if (typeof onFileOpenRequest === 'function') {
        onFileOpenRequest(path);
      }
    } else {
      this.toggleFileTreeNodeWithPath(path);
    }
  }

  async toggleFileTreeNodeWithPath(path) {
    try {
      let { walkPath, fileTreeNode } = this.findFileTreeNodeWithPath(path);

      if (!fileTreeNode) {
        console.error('Could not locate fileTreeNode');
        return;
      }

      // Detect if already open, or closed, and handle accordingly
      if (!fileTreeNode.toggled) {
        await this.expandFileTreeNode(fileTreeNode, walkPath);
      } else {
        await this.collapseFileTreeNode(fileTreeNode, walkPath);
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Grafts the given tree node into the file tree, setting the updated state.
   * 
   * @param {FileTreeNode} fileTreeNode 
   * @param {string} walkPath 
   */
  graftFileTreeNode(fileTreeNode, walkPath) {
    const { treeData } = this.state;

    // Absorb fileTreeNode data to mute compiler warnings with eval'd code
    _absorb(fileTreeNode);

    // Graft in the new fileTreeNode data
    // eslint-disable-next-line 
    eval(`treeData${walkPath} = fileTreeNode`);

    this.setState({
      treeData
    });
  }

  async expandFileTreeNode(fileTreeNode, walkPath) {
    try {
      const { path } = fileTreeNode;

      fileTreeNode = await this.fetchDirTreeData(path);
      fileTreeNode.toggled = true;

      this.graftFileTreeNode(fileTreeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
  }

  async collapseFileTreeNode(fileTreeNode, walkPath) {
    try {
      fileTreeNode.toggled = false;

      this.graftFileTreeNode(fileTreeNode, walkPath);
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

export default FileTree;