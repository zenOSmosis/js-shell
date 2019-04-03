import React, {Component} from 'react';
import $ from 'jquery';

export default class Scroll extends Component {


  render() {
    return (
      <div
        ref={ c => this._base = c }
        style={{width: '100%', maxWidth: '100%', height: '100%', overflowY: 'scroll'}}>
        {
          this.props.children
        }
      </div>
    )
  }
}