import React, { Component } from 'react';
import appRegistration from './appRegistration';
import P2PLinkedState from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';
import Window from 'components/Desktop/Window';
import { Layout, Content, Footer, Row, Column, Section } from 'components/Layout';
import { Input } from 'antd';
const { Search } = Input;

class PeopleConnectionWindow extends Component {
  render() {
    let { socketPeers, p2pConnections, ...propsRest } = this.props;
    
    socketPeers = socketPeers || [];
    
    return (
      <Window
        {...propsRest}
        appRegistration={appRegistration}
        toolbar={
          <Search
            size="small"
            placeholder="Search Users / Devices"
            style={{ minWidth: '220px' }}
          />
        }
      >
        <Layout>
          <Content>
            <Section>
              TODO: Implement https://github.com/feross/simple-peer<br />
              TODO: Implement spaces
            </Section>
            <Row>
              <Column>
                <h1>Available</h1>
                <ul style={{ listStyle: 'none', width: '100%' }}>
                  {
                    socketPeers.map((peer, idx) => {
                      return (
                        <li key={idx} style={{ border: '1px #fff solid' }}>
                          <div>
                            { peer }
                          </div>
                          <div>
                            OS: ... | ... | ...
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </Column>
              <Column>
                <h1>Connected</h1>
              </Column>
            </Row>
          </Content>
          <Footer style={{ overflow: 'auto' }}>
            <div style={{ float: 'right' }}>
              <button>
                View / Edit Your Profile
              </button>
            </div>
          </Footer>
        </Layout>
      </Window>
    );
  }
}

export default hocConnect(PeopleConnectionWindow, P2PLinkedState, (updatedState) => {
  return updatedState;
});