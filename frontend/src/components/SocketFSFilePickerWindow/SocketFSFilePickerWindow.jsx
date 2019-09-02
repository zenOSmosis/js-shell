import React, { Component } from 'react';
import Full from '../Full';
import Cover from '../Cover';
import Center from '../Center';
import Layout, { Content, Footer } from '../Layout';
import LinkedStateRenderer from '../LinkedStateRenderer';
import Window from '../Desktop/Window';
import SplitterLayout from '../SplitterLayout';
import SocketFSFileTree from '../SocketFSFileTree';
import SocketFSFolder, {
  LAYOUT_TYPE_ICON,
  LAYOUT_TYPE_TABLE,
  // LAYOUT_TYPES
} from '../SocketFSFolder';
import PathBreadcrumb from './subComponents/PathBreadcrumb';
import { Row, Column } from '../Layout';
import { ButtonGroup, Button } from '../ButtonGroup';
import { /*Input,*/ Icon as AntdIcon } from 'antd';
import HostFileDropZone from 'components/HostFileDropZone';
import UniqueSocketFSFilePickerLinkedState from './state/UniqueSocketFSFilePickerLinkedState';

class SocketFSFilePickerWindow extends Component {
  constructor(props) {
    super(props);

    this._linkedState = new UniqueSocketFSFilePickerLinkedState();
  }

  componentDidMount() {
    this._linkedState.setState({
      filePickerWindow: this,
      layoutType: LAYOUT_TYPE_TABLE,
    });

    const { onMount } = this.props;
    if (typeof onMount === 'function') {
      onMount(this);
    }
  }

  getLinkedState() {
    return this._linkedState;
  }

  componentWillUnmount() {
    this._linkedState.destroy();
    this._linkedState = null;
  }

  chdir(path) {
    // TODO: Verify path is a real directory

    this._linkedState.setState({
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

    this._linkedState.setState({
      selectedDirChildren
    });
  }

  setLayoutType(layoutType) {
    this._linkedState.setState({
      layoutType
    });
  }

  render() {
    const { onMount, ...propsRest } = this.props;

    return (
      <LinkedStateRenderer
        linkedState={this._linkedState}
        onUpdate={updatedState => {
          return updatedState;
        }}
        render={(renderProps) => {
          const { selectedDirChildren, layoutType, isRequestingCreateFile, isRequestingCreateDirectory } = renderProps;

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
              
              {
                (isRequestingCreateFile || isRequestingCreateDirectory) &&
                <Cover>
                  <Center>
                    <button onClick={evt => this._linkedState.setState({
                      isRequestingCreateFile: false,
                      isRequestingCreateDirectory: false
                    })}>
                      <input type="text" />
                      Cancel
                    </button>
                  </Center>
                </Cover>
              }
            </Window>
          );
        }}
      />
    );
  }
}

export default SocketFSFilePickerWindow;