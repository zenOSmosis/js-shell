// Note, out of simplicity, this FileTree is directly attached to socketFS

import React, { Component } from 'react';
import Scrollable from '../Scrollable';
import { Treebeard } from 'react-treebeard';
import { dirDetail } from 'utils/socketFS';
import './FileTree.typedefs';
import PropTypes from 'prop-types';

const _absorb = () => null;

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
            const { base, ...childRest } = child;

            return {
              ...childRest,
              name: base,
              toggled: false,
              // Sub-children don't need to render values at this branch level,
              // and setting undefined as the value removes the dropdown toggle
              children: (child.isDir ? [] : undefined)
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
   * @return {TreeNodeWithWalkPath} 
   */
  findTreeNodeWithPath(path) {
    const { treeData } = this.state;

    // Absorb treeNode data to mute compiler warnings with eval'd code
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
    const treeNode = eval(`this.state.treeData${walkPath}`);

    return {
      walkPath,
      treeNode
    };
    // }
  }

  async handleTreebeardToggle(treeNode) {
    const { path, isFile } = treeNode;

    if (isFile) {
      const { onFileOpenRequest } = this.props;
      if (typeof onFileOpenRequest === 'function') {
        onFileOpenRequest(path);
      }
    } else {
      this.toggleTreeNodeWithPath(path);
    }
  }

  async toggleTreeNodeWithPath(path) {
    try {
      let { walkPath, treeNode } = this.findTreeNodeWithPath(path);

      if (!treeNode) {
        console.error('Could not locate treeNode');
        return;
      }

      // Detect if already open, or closed, and handle accordingly
      if (!treeNode.toggled) {
        await this.expandTreeNode(treeNode, walkPath);
      } else {
        await this.collapseTreeNode(treeNode, walkPath);
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Grafts the given tree node into the file tree, setting the updated state.
   * 
   * @param {TreeNode} treeNode 
   * @param {string} walkPath 
   */
  graftTreeNode(treeNode, walkPath) {
    const { treeData } = this.state;

    // Absorb treeNode data to mute compiler warnings with eval'd code
    _absorb(treeNode);

    // Graft in the new treeNode data
    // eslint-disable-next-line 
    eval(`treeData${walkPath} = treeNode`);

    this.setState({
      treeData
    });
  }

  async expandTreeNode(treeNode, walkPath) {
    try {
      const { path } = treeNode;

      treeNode = await this.fetchDirTreeData(path);
      treeNode.toggled = true;

      this.graftTreeNode(treeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
  }

  async collapseTreeNode(treeNode, walkPath) {
    try {
      treeNode.toggled = false;

      this.graftTreeNode(treeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { treeData } = this.state;

    return (
      <Scrollable style={{ textAlign: 'left' }}>
        <Treebeard
          data={treeData}
          onToggle={treeNode => this.handleTreebeardToggle(treeNode)}
        />
      </Scrollable>
    )
  }
}

export default FileTree;