import React, { Component } from 'react';
import Center from 'components/Center';
import Full from 'components/Full';
import TileList, { Tile } from 'components/TileList';
import { Avatar } from 'antd';
import P2PLinkedState from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

import fetchRandomUsers from 'utils/fetchRandomUsers';

/**
 * @typedef {Object} P2PUser
 * @property {string} nickname
 * @property {string} imageSrc
 */

class UserList extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      users: []
    }
  }

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

  _handleUserClick(user, evt) {
    const { onUserClick } = this.props;

    if (typeof onUserClick === 'function') {
      onUserClick(user, evt);
    }
  }

  render() {
    let { socketPeerIDs } = this.props;
    socketPeerIDs = socketPeerIDs || [];

    const { users } = this.state;

    return (
      <TileList>
        {
          users.map((user, idx) => {
            return (
              <Tile
                key={idx}
                title={user.nickname}
                onClick={ evt => this._handleUserClick(user, evt) }
              >
                <img src={user.imageSrc} style={{width: '100%'}} />
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

export default hocConnect(UserList, P2PLinkedState, (updatedState) => {
  const { socketPeerIDs } = updatedState;

  if (typeof socketPeerIDs !== 'undefined') {
    return {
      socketPeerIDs
    };
  }
});

export {
  UserList
};