import React, { Component } from 'react';
import Full from '../Full';
import Layout, { Content, Footer } from '../Layout';
import SplitterLayout from '../SplitterLayout';
import SocketFSFileTree from '../SocketFSFileTree';
import SocketFSFolder from '../SocketFSFolder';

class SocketFSFilePicker extends Component {
  _handleDirChange(detail) {
    console.debug('Dir change detail', {
      detail
    });
  }

  render() {
    return (
      <Layout>
        <Content>
          <Full>
            <SplitterLayout
              primaryIndex={1}
              secondaryInitialSize={220}
            >
              <Full>
                <SocketFSFileTree
                  // rootDirectory={DEFAULT_ROOT_DIRECTORY}
                  // onFileOpenRequest={path => this._handleFileOpenRequest(path)}
                />
              </Full>

              <Full>
                <SocketFSFolder
                  onDirChange={detail => this._handleDirChange(detail)}
                />
              </Full>
            </SplitterLayout>
          </Full>
        </Content>
        <Footer>
          <div>
            Footer...
          </div>
        </Footer>
      </Layout>
    );
  }
}

export default SocketFSFilePicker;