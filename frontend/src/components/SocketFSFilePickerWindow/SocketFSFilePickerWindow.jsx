import React, { Component } from 'react';
import Window from '../Desktop/Window';
import SocketFSFilePicker from '../SocketFSFilePicker';
import PathBreadcrumb from './subComponents/PathBreadcrumb';

class SocketFSFilePickerWindow extends Component {
  state = {
    path: '/'
  };
  
  chdir(path) {
    this.setState({
      path
    });
  }

  render() {
    const { ...propsRest } = this.props;
    const { path } = this.state;

    return (
      <Window
        {...propsRest}
        toolbar={
          <PathBreadcrumb
            pathParts={['', 'shell']} // TODO: Remove hardcoding
            filesWindow={this}
          />
        }
      >
        <SocketFSFilePicker
          path={path}
        />
      </Window>
    );
  }
}

export default SocketFSFilePickerWindow;