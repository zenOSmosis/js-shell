import React, {Component} from 'react';
import Window from '../../Window';
import {Layout, Sider, Content, Footer} from '../../../Layout';
import DirectoryTree from './DirectoryTree';
import PathBreadcrumb from './PathBreadcrumb';
import './style.css';

export default class FileNavigator extends Component {
  render() {
    return (
      <Window
        title="File Navigator"
        subToolbar={
          <PathBreadcrumb path="/home/user/me" />
        }
      >
        <Layout className="FileNavigator">
          <Layout>
            <Sider className="LeftColumn" style={{backgroundColor: 'rgba(255,255,255,.8)'}}>
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