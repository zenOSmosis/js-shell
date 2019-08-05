import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
// import IFrame from 'components/IFrame';
import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';
import { ButtonGroup, Button } from 'components/ButtonGroup';
// import {Menu, MenuItem} from 'components/Menu';
import { Row, Column } from 'components/RowColumn';
import Switch from 'components/Switch';
// import DirectoryTree from './subComponents/DirectoryTree';
import PathBreadcrumb from './subComponents/PathBreadcrumb';
import IconLayout from './subComponents/IconLayout';
import { /*Input,*/ Icon as AntdIcon } from 'antd';
// import config from 'config';
import { chdir } from 'utils/fileSystem';
import './style.css';
import { relativeTimeRounding } from 'moment';

// import { Tree } from 'antd';
// const TreeNode = Tree.TreeNode;

export const LAYOUT_TYPE_ICON = 'icon';
export const LAYOUT_TYPE_TABLE = 'table';
export const LAYOUT_TYPES = [
  LAYOUT_TYPE_ICON,
  LAYOUT_TYPE_TABLE
];

// const { Search } = Input;

export default class FilesWindow extends Component {
  state = {
    selectedNodes: [],

    showHidden: true,

    // TODO: Rename to displayLayoutType
    layoutType: LAYOUT_TYPE_ICON,

    pathName: null,
    pathConstituents: [],

    childNodes: [], // fs child nodes for the current directory

    totalDirectorySubDirectories: 0,
    totalDirectoryFiles: 0,

    renderFilePath: null
  }

  componentDidMount() {
    // TODO: Use user's home directory, or decipher from prop
    // TODO: Use directory separator constant
    this.chdir('/');
  }

  selectNode(node) {
    const selectedNodes = [node];

    console.debug('selected nodes', selectedNodes);

    this.setState({
      selectedNodes
    });
  }

  openPath(pathName) {
    // TODO: Remove
    console.debug('rendering path name', pathName);

    this.setState({
      renderFilePath: pathName
    });
  }

  setLayoutType(layoutType) {
    if (!LAYOUT_TYPES.includes(layoutType)) {
      throw new Error('Unknown layout type:', layoutType);
    }

    this.setState({
      layoutType
    });
  }

  setShowHidden(showHidden) {
    // Force boolean conversion
    showHidden = showHidden === true;

    this.setState({
      showHidden
    });
  }

  async chdir(dirName) {
    try {
      console.debug('Changing directory to:', dirName);

      const dir = await chdir(dirName);

      const pathName = dir.path.name;
      const childNodes = dir.children;

      let totalDirectorySubDirectories = 0;
      let totalDirectoryFiles = 0;

      childNodes.forEach((childNode) => {
        if (childNode.isDir) {
          totalDirectorySubDirectories++;
        }

        if (childNode.isFile) {
          totalDirectoryFiles++;
        }
      });

      this.setState({
        pathName,
        childNodes,
        totalDirectorySubDirectories,
        totalDirectoryFiles,
        pathConstituents: dir.path.constituents
      }, () => {
        console.debug('Chaged directory', dir);
      });

      // const dirNodes = await ls(dirName);

      // console.debug('dirNodes', dirNodes);

      // console.debug('nodes', nodes);
      // this.setState({dirNodes});
    } catch (exc) {
      // TODO: Rework this
      this.openPath(dirName);

      // throw exc;
    }
  }

  render() {
    let {
      showHidden,
      childNodes,
      layoutType,
      pathConstituents,
      pathName
    } = this.state;

    if (!showHidden) {
      childNodes = childNodes.filter((childNode) => {
        return !childNode.isHidden;
      });
    }

    const { ...propsRest } = this.props;

    return (
      <Window
        {...propsRest}
        title={pathName}
        toolbar={
          <PathBreadcrumb filesWindow={this} pathParts={pathConstituents} />
        }
        toolbarRight={
          <Switch
            defaultChecked={showHidden}
            checkedChildren={<span>Hide Hidden</span>}
            unCheckedChildren={<span>Show Hidden</span>}
            onChange={showHidden => this.setShowHidden(showHidden)}
          />
        }
        subToolbar={
          <Row style={{ paddingTop: 4, paddingBottom: 4 }}>
            <Column style={{ textAlign: 'left', paddingLeft: 4 }}>
              <ButtonGroup>
                <Button disabled={true}><AntdIcon type="left" /></Button>
                <Button disabled={false}><AntdIcon type="right" /></Button>
              </ButtonGroup>
            </Column>

            <Column style={{ textAlign: 'center' }}>
              {
                // Layout options (grid or list)
                <ButtonGroup>
                  <Button
                    disabled={layoutType === LAYOUT_TYPE_ICON}
                    onClick={evt => this.setLayoutType(LAYOUT_TYPE_ICON)}
                  >
                    <AntdIcon type="table" />
                  </Button>

                  <Button
                    disabled={layoutType === LAYOUT_TYPE_TABLE}
                    onClick={evt => this.setLayoutType(LAYOUT_TYPE_TABLE)}
                  >
                    <AntdIcon type="unordered-list" />
                  </Button>
                </ButtonGroup>
              }
            </Column>

            <Column style={{ textAlign: 'right', paddingRight: 4 }}>
              {
                // FS node actions
                <ButtonGroup>
                  <Button disabled><AntdIcon type="folder-open" /></Button>
                  <Button disabled><AntdIcon type="copy" /></Button>
                  <Button disabled><AntdIcon type="scissor" /></Button>
                  <Button disabled><AntdIcon type="delete" /></Button>
                </ButtonGroup>
              }
            </Column>
          </Row>
        }
      >
        <Layout className="FileNavigator">
          <Layout>
            {
              /*
              <Sider className="LeftColumn">
                <Full style={{overflow: 'auto'}}>
                  {
                    // <DirectoryTree />
                  }
                  <div>
                    <div>
                      Block Devices
                    </div>
                    <Tree>
                      <TreeNode
                        title={
                          <div>
                            Samsung<br />
                            ... | ...
                          </div>
                        }
                      />
                    </Tree>
                  </div>
                </Full>
              </Sider>
              */
            }
            <Content className="Main">
              {
                (() => {
                  const { layoutType } = this.state;

                  switch (layoutType) {
                    case LAYOUT_TYPE_ICON:
                      return (
                        <IconLayout
                          filesWindow={this}
                          fsNodes={childNodes}
                        />
                      );

                    case LAYOUT_TYPE_TABLE:
                      return (
                        <div>TODO: Build out table layout</div>
                      );

                    default:
                      throw new Error('Unknown layout type:', layoutType);
                  }
                })()
              }
            </Content>
          </Layout>
          {
            // Prototype of URI-based file open (not deal w/ streams directly)
            /*
            this.state.renderFilePath &&
            <div style={{width: 500, height: 500}}>
              To render... {`${config.HOST_REST_URI}/files?filePath=${this.state.renderFilePath}`}<br />
              <IFrame src={`${config.HOST_REST_URI}/files?filePath=${this.state.renderFilePath}`} />
            </div>
            */
          }
          <Footer className="Footer" style={{ textAlign: 'left' }}>
            {
              this.state.selectedNodes &&
              <div>
                {
                  this.state.selectedNodes.length > 1 &&
                  <div>
                    Selected nodes: {this.state.selectedNodes.length}
                  </div>
                }

                {
                  this.state.selectedNodes.length === 1 &&
                  ((node) => {
                    return (
                      <div>
                        Type:&nbsp;
                          {node.isDir ? 'Directory' : ''}
                        {node.isFile ? 'File' : ''}
                      </div>
                    );
                  })(this.state.selectedNodes[0])
                }
              </div>
            }
            <hr />
            <Row>
              <Column>
                TODO Integrate:<br />
                - https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_fswatcher<br />
                - Show free space<br />
                - Preliminary opening of files<br />
                - Drag / Drop of node nodes into other windows<br />
                - Opening of node in other window if node is dragged to it
              </Column>
              <Column style={{ textAlign: 'right' }}>
                Files: {this.state.totalDirectoryFiles}<br />
                Folders: {this.state.totalDirectorySubDirectories}
              </Column>
            </Row>
          </Footer>
        </Layout>
      </Window>
    );
  }
}