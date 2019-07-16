import React, { Component } from 'react';
import IFrame from '../IFrame';

export default class AnalogVUMeter extends Component {
  constructor(...args) {
    super(...args);

    this._iFrame = null;
  }

  componentDidMount() {
    const { onMount } = this.props;

    if (typeof onMount === 'function') {
      onMount(this);
    }
  }

  componentWillUnmount() {
    this._iFrame = null;
  }

  // TODO: Document
  setVULevel(vuLevel) {
    if (this._iFrame) {
      this._iFrame.postMessage({
        vuLevel
      });
    }
  }

  render() {
    return (
      <IFrame ref={c => this._iFrame = c} src="/components/analog-vu-meter" />
    )
  }
}