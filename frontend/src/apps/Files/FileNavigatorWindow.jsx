import React, { Component } from 'react';
import appConfig from './appConfig';
import Window from '../../components/Desktop/Window';
import { Layout, Sider, Content, Footer } from '../../components/Layout';
import { ButtonGroup, Button } from '../../components/ButtonGroup';
import DirectoryTree from './DirectoryTree';
import PathBreadcrumb from './PathBreadcrumb';
import './style.css';

export default class FileNavigator extends Component {
  render() {
    return (
      <Window
        appConfig={appConfig}
        subToolbar={
          <div>
            <div style={{ float: 'left', position: 'relative' }}>
              &nbsp;
              <div style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
                <ButtonGroup>
                  <Button>Places</Button>
                  <Button>Tree</Button>
                </ButtonGroup>
              </div>
            </div>

            <PathBreadcrumb path="/home/user/me" />
          </div>
        }
      >
        <Layout className="FileNavigator">
          <Layout>
            <Sider className="LeftColumn" style={{ backgroundColor: 'rgba(255,255,255,.8)' }}>
              <DirectoryTree />
            </Sider>
            <Content className="Main">
              Nodes
            </Content>
          </Layout>
          <Footer className="Footer">

          </Footer>
        </Layout>
      </Window>
    );
  }
}