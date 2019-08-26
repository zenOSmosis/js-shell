import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import FileTree from 'components/FileTree';

const ProtoWindow = (props) => {
  return (
    <Window>
      <FileTree
        onFileOpenRequest={ path => alert('request to open file ' + path)}
      />
    </Window>
  );
};

export default ProtoWindow;