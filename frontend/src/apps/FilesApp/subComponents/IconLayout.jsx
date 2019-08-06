import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Icon from 'components/Icon';
import { Icon as AntdIcon } from 'antd';
import FileIcon from 'react-file-icon';

export default class IconLayout extends Component {

  render() {
    const { filesWindow, fsNodes } = this.props;

    return (
      <Scrollable>
        {
          fsNodes.map((childNode, idx) => {
            //console.debug('child node', childNode);

            return (
              <Icon
                onClick={ (evt) => filesWindow.selectNode(childNode) }
                onDoubleClick={ (evt) => {filesWindow.open(childNode)} }
                // onContextMenu={ (evt) => console.warn('TODO: Build new context menu provider') }
                key={idx}
                width={120}
                height={120}
                style={{
                  margin: 10,
                  backgroundColor: this.props.selectedNodes.indexOf(childNode) > -1 ? 'rgba(78, 131, 177, 0.41)' : null
                }}
                title={childNode.path.name}
              >
                {
                  childNode.isFile &&
                  <FileIcon extension={childNode.path.ext} size={40} />
                }

                {
                  childNode.isDir &&
                  <AntdIcon type="folder" style={{fontSize: 40}} />
                }
                
              </Icon>
            );
          })
        }
      </Scrollable>
    )
  }
}