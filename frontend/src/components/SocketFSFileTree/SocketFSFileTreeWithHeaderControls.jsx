import React, { Component } from 'react';
import { Layout, Header, Content } from '../Layout';
import SocketFSFileTree from './SocketFSFileTree';
import { IoIosRefresh } from 'react-icons/io';

class SocketFSFileTreeWithHeaderControls extends Component {
  render() {
    const { ...propsRest} = this.props;

    return (
      <Layout>
        <Header style={{height: '1.4rem', fontSize: '1.01rem', textAlign: 'right'}}>
          <button title="Refresh" style={{backgroundColor: 'transparent', border: '0px'}}>
            <IoIosRefresh  />
          </button>
        </Header>
        <Content>
          <SocketFSFileTree 
            {...propsRest}
          />
        </Content>
      </Layout>
    );
  }
}

export default SocketFSFileTreeWithHeaderControls;