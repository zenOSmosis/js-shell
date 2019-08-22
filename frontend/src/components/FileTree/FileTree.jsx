import React, { Component } from 'react';
import { Treebeard } from 'react-treebeard';

class FileTree extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
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

    return (
      <Treebeard
        data={data}
        onToggle={evt => console.debug(evt)}
      />
    )
  }
}

export default FileTree;