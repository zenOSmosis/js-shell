import React from 'react';
import Window from 'components/Desktop/Window';
import FileTree from 'components/FileTree';

const ProtoWindow = (props) => {
  return (
    <Window
      {...props}
    >
      <FileTree
        onFileOpenRequest={ path => alert('request to open file ' + path)}
      />
    </Window>
  );
};

export default ProtoWindow;