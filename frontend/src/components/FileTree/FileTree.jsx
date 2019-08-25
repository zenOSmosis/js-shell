// Note, out of simplicity, this FileTree is directly attached to socketFS

import React, { Component } from 'react';
import { Treebeard } from 'react-treebeard';
import { dirDetail } from 'utils/socketFS';
import './FileTree.typedefs';

class FileTree extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      // TODO: Document this type
      treeData: {},

      /**
       * The directory paths which currently appear in the tree
       * 
       * @type {string[]}
       */
      toggledPaths: []
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
        name: rawDirDetail.name,
        path: rawDirDetail.path, // Normalized path
        toggled: true,
        children: (() => {
          /*
          if (!rawDirDetail.children) {
            return undefined;
          }
          */

          return rawDirDetail.children.filter(child => {
            // Skip error nodes
            if (child.error) {
              console.warn('Skipping errored child', child);
            }
            return !child.error
          }).map(child => {
            return {
              name: child.name,
              path: child.path,
              toggled: false,
              // Children of the child are an array of strings (string[])
              children: (child.isFile ? undefined : child.children && child.children.map(subChild => {
                return {
                  name: subChild.name
                };
              }))
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

    const SEARCH_KEY_PATH = 'path';
    const SEARCH_KEY_CHILDREN = 'children';

    const r_find = (path, walkPath = '') => {
      const subKeys = Object.keys(eval(`treeData${walkPath}`));
      for (const key of subKeys) {
        switch (key) {
          case SEARCH_KEY_PATH:
            const treeDataPath = eval(`treeData${walkPath}[key]`);

            if (path === treeDataPath) {
              return walkPath;
            }
            break;

          case SEARCH_KEY_CHILDREN:
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
        }
      }
    };

    let walkPath = r_find(path);

    if (!walkPath) {
      console.warn('Could not obtain walk path for path', path);
      
      walkPath = '';
    }

    // if (walkPath) {
    const treeNode = eval(`this.state.treeData${walkPath}`);

    return {
      walkPath,
      treeNode
    };
    // }
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
        await this.openTreeNode(treeNode, walkPath);
      } else {
        await this.closeTreeNode(treeNode, walkPath);
      }
    } catch (exc) {
      throw exc;
    }
  }

  graftTreeNode(treeNode, walkPath) {
    const { treeData } = this.state;

    // Absorb treeNode data to mute compiler warnings
    treeNode = treeNode;

    // Graft in the new treeNode data
    eval(`treeData${walkPath} = treeNode`);

    this.setState({
      treeData
    });
  }

  async openTreeNode(treeNode, walkPath) {
    try {
      const { path } = treeNode;

      treeNode = await this.fetchDirTreeData(path);
      treeNode.toggled = true;

      this.graftTreeNode(treeNode, walkPath);
    } catch (exc) {
      throw exc;
    }
    // TODO: Walk state treeData and insert 'loading' property

    // TODO: Set the state, and wait for rendering callback

    // TODO: Fetch new path information

    // TODO: Graft the new path information back into the tree

    // TODO: Update the new state


  }

  async closeTreeNode(treeNode, walkPath) {
    try {
      treeNode.toggled = false;

      this.graftTreeNode(treeNode, walkPath);
    } catch (exc) {
      throw exc;
    }

    // TODO: Walk the treeData, and find the relevant treeNode

    // TODO: Set the relevant treeNode toggle to false, and also clear child data

    // TODO: Update the new state
  }

  render() {
    const { treeData } = this.state;

    return (
      <Treebeard
        data={treeData}
        onToggle={evt => this.toggleTreeNodeWithPath(evt.path)}
      />
    )
  }
}

/*
const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [
        { name: 'child1' },
        { name: 'child2' }
      ]
    },
    {
      name: 'loading parent',
      toggled: true,
      // loading: true,
      children: [
        { name: 'child1' },
        { name: 'child2' }
      ]
    },
    {
      name: 'parent',
      children: [
        {
          name: 'nested parent',
          children: [
            { name: 'nested child 1' },
            { name: 'nested child 2' }
          ]
        }
      ]
    }
  ]
};
*/

export default FileTree;