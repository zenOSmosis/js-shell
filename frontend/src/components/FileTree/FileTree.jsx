// Note, out of simplicity, this FileTree is directly attached to socketFS

import React, { Component } from 'react';
import { Treebeard } from 'react-treebeard';
import { dirDetail } from 'utils/socketFS';

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

  componentDidMount() {
    this.fetchDirDetail('/');
  }

  async fetchDirDetail(path) {
    try {
      const rawDirDetail = await dirDetail(path);

      const treeData = {
        name: rawDirDetail.name,
        toggled: true,
        children: rawDirDetail.children.filter(child => {
          return child.isDir;
        }).map(child => {
          return {
            name: child.name,
            path: child.path
          }
        })
      };

      this.setState({
        treeData
      });
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { treeData } = this.state;

    return (
      <Treebeard
        data={treeData}
        onToggle={evt => console.debug(evt)}
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