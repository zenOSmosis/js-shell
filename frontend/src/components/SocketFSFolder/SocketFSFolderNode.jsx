import React from 'react';
import PropTypes from 'prop-types';

const SocketFSFolderNode = (props) => {
  const {
    children: renderedChildren,
    dirChild,
    socketFSFolderComponent
  } = props;
  
  return (
    <div
      onMouseDown={evt => socketFSFolderComponent.selectDirChild(dirChild)}
      onMouseUp={evt => socketFSFolderComponent.unselectDirChild(dirChild)}
      // onMouseDown={evt => console.debug('mouseDown', {evt, ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey})}
      // onTouchStart={}

      // onDoubleClick={ evt => socketFSFolderComponent._handleDirNav(pathDetailChild) }
      // onTouchEnd={ evt => socketFSFolderComponent._handleDirNav(pathDetailChild) }
    >
      {
        renderedChildren
      }
    </div>
  );
};

SocketFSFolderNode.propTypes = {
  dirChild: PropTypes.object.isRequired,
  socketFSFolderComponent: PropTypes.object.isRequired
};

export default SocketFSFolderNode;