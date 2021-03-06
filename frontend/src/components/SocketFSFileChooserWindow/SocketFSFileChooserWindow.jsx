import React, { Component } from 'react';
import Full from '../Full';
import Cover from '../Cover';
import Center from '../Center';
import LabeledComponent from '../LabeledComponent';
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
import { ButtonGroup, Button } from '../ButtonGroup';
import { /*Input,*/ Icon as AntdIcon } from 'antd';
import FileDropZone from 'components/FileDropZone';
import UniqueFileChooserLinkedState, {
  ACTION_CHDIR
} from 'state/UniqueFileChooserLinkedState';
import openFile from 'utils/desktop/openFile';

class SocketFSFileChooserWindow extends Component {
  constructor(props) {
    super(props);

    this._linkedState = new UniqueFileChooserLinkedState();
    this._windowComponent = null;
    this._shouldCloseOnFileOpen = true;
  }

  componentDidMount() {
    // Determine if the Window should close after file is opened
    (() => {
      const { shouldCloseOnFileOpen: propsShouldCloseOnFileOpen } = this.props;
      const shouldCloseOnFileOpen = (
        propsShouldCloseOnFileOpen === undefined ?
        
          // Default
        this._shouldCloseOnFileOpen :
        
        propsShouldCloseOnFileOpen
      );
      this._shouldCloseOnFileOpen = shouldCloseOnFileOpen;
    })();

    const { dialogParams } = this.props;
    if (dialogParams) {
      console.warn('TODO: Handle file chooser dialog params', {
        dialogParams
      });
    }

    this._linkedState.setState({
      fileChooserWindow: this,
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
    this._linkedState.dispatchAction(ACTION_CHDIR, path);
  }

  async _handleFileOpenRequest(filePath) {
    try {
      await openFile(filePath);

      if (this._shouldCloseOnFileOpen) {
        await this._windowComponent.close();
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Internally called when SocketFSFolder changes directory.
   * 
   * @param {Object} detail 
   */
  _handleSocketFSFolderDirChange(detail) {
    const { path } = detail;

    if (path) {
      this.chdir(path);
    }
  }

  /**
 * Internally called when SocketFSFolder changes path selection.
 * 
 * @param {Object[]} detail 
 */
  _handleSocketFSFolderSelectedDirChildrenChange(selectedDirChildren) {
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
    const {
      onMount,
      shouldCloseOnFileOpen,
      ...propsRest
    } = this.props;

    return (
      <LinkedStateRenderer
        linkedState={this._linkedState}
        onUpdate={updatedState => {
          console.warn({ updatedState });

          return updatedState;
        }}
        render={(renderProps) => {
          const {
            cwd,
            dirDetail,
            selectedDirChildren,
            layoutType,
            isRequestingCreateFile,
            isRequestingCreateDirectory
          } = renderProps;

          return (
            <Window
              {...propsRest}
              ref={ c => this._windowComponent = c }
              toolbar={
                <PathBreadcrumb
                  cwd={cwd}
                  dirDetail={dirDetail}
                  filesWindow={this}
                />
              }
              toolbarRight={
                <LabeledComponent
                  label="Layout"
                >
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
                </LabeledComponent>
              }
            >
              <FileDropZone>
                <Layout>
                  <Content>
                    <Full>
                      <SplitterLayout
                        primaryIndex={1}
                        secondaryInitialSize={220}
                      >
                        <Full>
                          <SocketFSFileTree
                          rootDirectory={cwd}
                          onExternalFileOpenRequest={path => this._handleFileOpenRequest(path)}
                          />
                        </Full>

                        <Full>
                          <SocketFSFolder
                            layoutType={layoutType}
                            cwd={cwd}
                            onDirChange={detail => this._handleSocketFSFolderDirChange(detail)}
                            onSelectedDirChildrenChange={selectedDirChildren => this._handleSocketFSFolderSelectedDirChildrenChange(selectedDirChildren)}
                            onExternalFileOpenRequest={path => this._handleFileOpenRequest(path)}
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
              </FileDropZone>

              {
                (isRequestingCreateFile || isRequestingCreateDirectory) &&
                <Cover>
                  <Center>
                    <div>
                      <div>
                        [ Create X ]
                          <button onClick={evt => this._linkedState.setState({
                          isRequestingCreateFile: false,
                          isRequestingCreateDirectory: false
                        })}>

                          Cancel
                          </button>
                      </div>
                      <div>
                        <input type="text" />

                        <button>Create</button>
                      </div>
                    </div>
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

export default SocketFSFileChooserWindow;