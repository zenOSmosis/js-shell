import React, { Component } from 'react';
import Center from 'components/Center';
import Full from 'components/Full';
import { Avatar } from 'antd';
import P2PLinkedState from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

class UserList extends Component {
  render() {
    let { socketPeers } = this.props;
    socketPeers = socketPeers || [];

    return (
      <Full>
        {
          socketPeers.length === 0 &&
          <Center>
            <span style={{fontStyle: 'italic'}}>No connected peers...</span>
          </Center>
        }
        {
          socketPeers.length > 0 &&
          <ul style={{ listStyle: 'none', width: '100%' }}>
            {
              socketPeers.map((peer, idx) => {
                return (
                  <li
                    key={idx}
                    style={{margin: 20}}
                  >
                    <div style={{display: 'inline-block'}}>
                      <Avatar size={48} icon="user" />
                    </div>
                    hello
                    <div>
                      {peer}
                    </div>
                    <div>
                      OS: ... | ... | ...
                    </div>
                    <div>
                      <button>Message</button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        }
      </Full>
    )
  }
}

export default hocConnect(UserList, P2PLinkedState, (updatedState) => {
  const { socketPeers } = updatedState;

  if (typeof socketPeers !== 'undefined') {
    return {
      socketPeers
    };
  }
});

export {
  UserList
};