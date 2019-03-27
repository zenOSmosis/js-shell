import React, {Component} from 'react';
import RenderObject from '../RenderObject';
import FullViewportPanel from '../FullViewportPanel';
import socket from './../../utils/socket.io';

export default class FullViewportSocketIOInformation extends Component {
  render () {
    return (
      <FullViewportPanel
        {...this.props}
      >
        hello
      </FullViewportPanel>
    );
  }
}