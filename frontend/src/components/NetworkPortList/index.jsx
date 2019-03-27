import React, {Component} from 'react';
import socket from './../../utils/socket.io';

export default class NetworkPortList extends Component {
  render () {
    return (
      <div>
        NetworkPortList
        <button onClick={ (evt) => socket.emit('fetch-network-interfaces', null, data =>
          {
            console.log(data);
          }
        )}>
          Fetch
        </button>
      </div>
    );
  }
}