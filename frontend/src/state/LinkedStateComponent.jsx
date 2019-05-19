import React, { Component } from 'react';
import { EVT_LINKED_STATE_WILL_UPDATE, EVT_LINKED_STATE_UPDATE, EVT_LINKED_STATE_DID_UPDATE } from './LinkedState';

/**
 * Does not use HOC pattern, and instead extends React Component with Linked
 * State lifecycle hooks.
 */
export default class LinkedStateComponent extends Component {
  state = {};

  constructor(LinkedStateClasses) {
    super();

    // const {LinkedStateClass} = props;
    if (!Array.isArray(LinkedStateClasses)) {
      LinkedStateClasses = [LinkedStateClasses];
    }

    this._linkedStateInstance = new LinkedStateClasses[0];

    (() => {
      this._linkedStateInstance.on(EVT_LINKED_STATE_UPDATE, this._handleInternalLinkedStateUpdate);

      const initialState = this._linkedStateInstance.getState();

      this.state = initialState;

      // Set initial state
      // this._handleInternalLinkedStateUpdate(initialState);
    })();
  }

  componentDidMount() {
    if (typeof super.componentDidMount === 'function') {
      super.componentDidMount();
    }

    this._handleInternalLinkedStateUpdate(this.state);
  }

  componentWillUnmount() {
    if (typeof super.componentWillUnmount === 'function') {
      super.componentWillUnmount();
    }

    // Discard LinkedStateInstance
    // this._linkedStateInstance.off(EVT_LINKED_STATE_UPDATE, this._handleInternalLinkedStateUpdate);
    this._linkedStateInstance.destroy();
    this._linkedStateInstance = undefined;
  }

  linkedStateUpdateFilter(updatedState, prevState, linkedStateInstance) {
    return updatedState;
  }

  /**
   * Automatically invoked when a LinkedState instance will update.
   * 
   * @param {LinkedState} linkedStateInstance 
   * @param {object} prevState 
   */
  /*
  linkedStateWillUpdate(linkedStateInstance, prevState) {
  }
  */

  /**
   * Automatically invoked when a LinkedState instance did update.
   * 
   * @param {LinkedState} linkedStateInstance 
   * @param {object} prevState 
   */
  /*
  linkedStateDidUpdate(linkedStateInstance, prevState) {
  }
  */

  _handleInternalLinkedStateUpdate = (internalUpdatedState) => {
    // console.debug('LinkedStateComponent linked state update', updatedState);

    const updatedState = this.linkedStateUpdateFilter(internalUpdatedState);

    // TODO: Reimplement stateUpdateFilter
    /*
    if (typeof stateUpdateFilter === 'function') {
      // Overwrite updatedState w/ filter response
      updatedState = stateUpdateFilter(updatedState) || {};
    }
    */

    if (updatedState) {
      this.setState(updatedState);
    }
  }
};

export { React };