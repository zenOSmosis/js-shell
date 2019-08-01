import React, { Component } from 'react';
import Center from 'components/Center';
import Full from 'components/Full';
import TileList, { Tile } from 'components/TileList';
import { Avatar } from 'antd';
import P2PLinkedState from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

// import fetchRandomUsers from 'utils/fetchRandomUsers';

/**
 * @typedef {Object} P2PUser
 * @property {string} nickname
 * @property {string} imageSrc
 */

class SocketPeerList extends Component {
  /*
  componentDidMount() {
    // Fetching of random users
    // TODO: Remove

    (async () => {
      try {
        const randomUsers = await fetchRandomUsers();
        const lenRandomUsers = randomUsers.length;

        const users = [];

        for (let i = 0; i < lenRandomUsers; i++) {
          const randomUser = randomUsers[i];

          users.push({
            nickname: randomUser.name.first,
            imageSrc: randomUser.picture.large
          });
        }

        this.setState({
          users
        });
      } catch (exc) {
        throw exc;
      }
    })();
  }
  */

 _handleSocketPeerClick(socketPeerID, evt) {
    const { onSocketPeerClick } = this.props;

    if (typeof onSocketPeerClick === 'function') {
      onSocketPeerClick(socketPeerID, evt);
    }
  }

  render() {
    let { socketPeerIDs } = this.props;
    socketPeerIDs = socketPeerIDs || [];

    return (
      <TileList>
        {
          socketPeerIDs.map((socketPeerID, idx) => {
            return (
              <Tile
                key={idx}
                // title={user.nickname}
                onClick={ evt => this._handleSocketPeerClick(socketPeerID, evt) }
              >
                {socketPeerID}
                {
                  // <img src={user.imageSrc} style={{width: '100%'}} />
                }
              </Tile>
            );
          })
        }
      </TileList>
    );

    /*
    return (
      <Full>
        {
          socketPeerIDs.length === 0 &&
          <Center>
            <span style={{fontStyle: 'italic'}}>No connected peers...</span>
          </Center>
        }
        {
          // TODO: Replace with <TileList />
          socketPeerIDs.length > 0 &&
          <ul style={{ listStyle: 'none', width: '100%' }}>
            {
              socketPeerIDs.map((peer, idx) => {
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
    */
  }
}

export default hocConnect(SocketPeerList, P2PLinkedState, (updatedState) => {
  const { socketPeerIDs } = updatedState;

  if (typeof socketPeerIDs !== 'undefined') {
    return {
      socketPeerIDs
    };
  }
});

export {
  SocketPeerList
};