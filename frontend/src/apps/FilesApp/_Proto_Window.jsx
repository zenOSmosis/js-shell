import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import FileTree from 'components/FileTree';

const ProtoWindow = (props) => {
  return (
    <Window>
      <Scrollable style={{textAlign: 'left'}}>
        <FileTree />
      </Scrollable>
    </Window>
  );
};

export default ProtoWindow;