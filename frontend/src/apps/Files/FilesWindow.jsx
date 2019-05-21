import React, { Component } from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
import Full from 'components/Full';
import Icon from 'components/Icon';
import IFrame from 'components/IFrame';
import { Layout, Sider, Content, Footer } from 'components/Layout';
import { ButtonGroup, Button } from 'components/ButtonGroup';
import {Row, Column} from 'components/RowColumn';
// import DirectoryTree from './subComponents/DirectoryTree';
import PathBreadcrumb from './subComponents/PathBreadcrumb';
// import {Menu, MenuItem} from 'components/Menu';
import {chdir} from 'utils/fileSystem';
import {Input, Icon as AntdIcon} from 'antd';
import config from 'config';
import './style.css';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

const {Search} = Input;

export default class FilesWindow extends Component {
  state = {
    selectedNodes: [],

    pathName: null,
    pathConstituents: [],
    childNodes: [],

    totalDirectorySubDirectories: 0,
    totalDirectoryFiles: 0,

    renderFilePath: null
  }

  componentDidMount() {
    // TODO: Use user's home directory, or decipher from prop
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
    console.debug('rendering path name', pathName);
    // app.addWindow(<Window title="Test Window" />);
    this.setState({
      renderFilePath: pathName
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
    const {pathConstituents} = this.state;

    return (
      <Window
        app={app}
        // title={this.state.pathName}
        title={this.state.pathName}
        toolbarRight={
          <Search size="small" />
        }
        subToolbar={
          <div>
            <div style={{ float: 'left', position: 'relative' }}>
              &nbsp;
              <div style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
                <ButtonGroup>
                  <Button disabled={true}><AntdIcon type="left" /></Button>
                  <Button disabled={false}><AntdIcon type="right" /></Button>
                </ButtonGroup>
              </div>
            </div>

            <PathBreadcrumb filesWindow={this} pathParts={pathConstituents} />
          </div>
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
              <Full style={{overflow: 'auto', textAlign: 'left'}}>
                {
                  this.state.childNodes.map((childNode, idx) => {
                    return (
                      <Icon
                        onClick={ (evt) => this.selectNode(childNode) }
                        onDoubleClick={ (evt) => this.chdir(childNode.pathName) }
                        key={idx}
                        width={80}
                        height={80}
                        style={{margin: 10}}
                        title={childNode.path.name}
                      />
                    );
                  })
                }
                {
                  this.state.renderFilePath &&
                  <div style={{width: 500, height: 500}}>
                    To render... {`${config.HOST_REST_URI}/files?filePath=${this.state.renderFilePath}`}<br />
                    <IFrame src={`${config.HOST_REST_URI}/files?filePath=${this.state.renderFilePath}`} />
                  </div>
                }
              </Full>
            </Content>
          </Layout>
          <Footer className="Footer" style={{textAlign: 'left'}}>
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
              <Column style={{textAlign: 'right'}}>
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