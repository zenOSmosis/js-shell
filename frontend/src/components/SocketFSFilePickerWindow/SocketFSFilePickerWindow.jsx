import React, { Component } from 'react';
import Full from '../Full';
import Layout, { Content, Footer } from '../Layout';
import Window from '../Desktop/Window';
import SplitterLayout from '../SplitterLayout';
import SocketFSFileTree from '../SocketFSFileTree';
import SocketFSFolder from '../SocketFSFolder';
import PathBreadcrumb from './subComponents/PathBreadcrumb';
import { Row, Column } from '../Layout';
import { ButtonGroup, Button } from '../ButtonGroup';
import { /*Input,*/ Icon as AntdIcon } from 'antd';
import HostFileDropZone from 'components/HostFileDropZone';

export const LAYOUT_TYPE_ICON = 'icon';
export const LAYOUT_TYPE_TABLE = 'table';
export const LAYOUT_TYPES = [
  LAYOUT_TYPE_ICON,
  LAYOUT_TYPE_TABLE
];

class SocketFSFilePickerWindow extends Component {
  state = {
    cwd: '/',

    layoutType: LAYOUT_TYPE_TABLE,

    selectedDirChildren: []
  };

  chdir(path) {
    // TODO: Verify path is a real directory

    this.setState({
      cwd: path
    });
  }

  _handleDirChange(detail) {
    // TODO: Remove
    console.debug('Dir change detail', {
      detail
    });
  }

  _handleSelectedDirChildrenChange(selectedDirChildren) {
    // TODO: Remove
    console.debug('Selected dir children change', {
      selectedDirChildren
    });

    this.setState({
      selectedDirChildren
    });
  }

  setLayoutType(layoutType) {
    this.setState({
      layoutType
    });
  }

  render() {
    const { ...propsRest } = this.props;
    const { selectedDirChildren, layoutType } = this.state;

    return (
      <Window
        {...propsRest}
        toolbar={
          <PathBreadcrumb
            pathParts={['', 'shell']}
            filesWindow={this}
          />
        }
        subToolbar={
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                {
                  // Layout options (grid or list)
                  <ButtonGroup>
                    <Button
                      disabled={layoutType === LAYOUT_TYPE_ICON}
                      onClick={evt => this.setLayoutType(LAYOUT_TYPE_ICON)}
                      title="Grid"
                    >
                      <AntdIcon type="table" />
                    </Button>

                    <Button
                      disabled={layoutType === LAYOUT_TYPE_TABLE}
                      onClick={evt => this.setLayoutType(LAYOUT_TYPE_TABLE)}
                      title="List"
                    >
                      <AntdIcon type="unordered-list" />
                    </Button>
                  </ButtonGroup>
                }
              </Column>
            </Row>
          </div>
        }
      >
        <HostFileDropZone>
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
                      layoutType={layoutType}
                      onDirChange={detail => this._handleDirChange(detail)}
                      onSelectedDirChildrenChange={selectedDirChildren => this._handleSelectedDirChildrenChange(selectedDirChildren)}
                    />
                  </Full>
                </SplitterLayout>
              </Full>
            </Content>
            <Footer>
              <div>
                {selectedDirChildren.length} selected
              </div>
            </Footer>
          </Layout>
        </HostFileDropZone>
      </Window>
    );
  }
}

export default SocketFSFilePickerWindow;