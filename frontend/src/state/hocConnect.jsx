/**
 * @module state/hocConnect
 */

import React, { Component } from 'react';
import { EVT_LINKED_STATE_UPDATE } from './LinkedState/LinkedState';

/**
 * 
 * Connects LinkedState (or derivative) to a React component's lifecycle.
 * 
 * TODO: Document stateUpdateFilter arguments.
 *
 * @see https://reactjs.org/docs/higher-order-components.html
 * 
 * @param {Component} WrappedComponent 
 * @param {LinkedState} LinkedState A passed LinkedState class, extension, or
 * instance of.
 * @param {Function | null} stateUpdateFilter [default = null] Applies this
 * filtered value to the component props when the state is updated.
 */
const hocConnect = (WrappedComponent, LinkedState, stateUpdateFilter = null/* onConstruct = null */) => {
  // Enables ref to be obtained from stateful components, ignoring ref if not.
  // (e.g. if WrappedComponent extends React.Component the ref can be referenced here)
  const RefForwardedComponent = React.forwardRef((props, ref) => {
    if (WrappedComponent.prototype.render) {
      return (
        <WrappedComponent ref={ref} {...props} />
      );
    } else {
      return (
        <WrappedComponent {...props} />
      );
    }
  });

  // Whether or not the passed LinkedState is a class, or a constructed object
  const isLinkedStateClass = (LinkedState.prototype && LinkedState.prototype.constructor ? true : false);

  // ...and returns another component...
  return class extends Component {
    constructor(props) {
      if (!WrappedComponent) {
        throw new Error('Missing WrappedComponent.  A React Component must be specified to be wrapped.');
      }

      super(props);

      if (isLinkedStateClass) {
        this._linkedStateInstance = new LinkedState();
      } else {
        this._linkedStateInstance = LinkedState;
      }

      if (!this._linkedStateInstance) {
        throw new Error('No LinkedState present');
      }

      // Set initial state
      this.state = (() => {
        const currState = this._linkedStateInstance.getState();
        
        if (!stateUpdateFilter) {
          // Pass the current state as the initial state
          return currState;
        } else {
          // Pass the filtered state as the initial state
          return stateUpdateFilter(currState, this._linkedStateInstance);
        }
      })();

      this._linkedStateInstance.on(EVT_LINKED_STATE_UPDATE, this._handleLinkedStateUpdate);
    }

    componentWillUnmount() {
      // Unregister LinkedState connection
      (() => {
        this._linkedStateInstance.off(EVT_LINKED_STATE_UPDATE, this._handleLinkedStateUpdate);

        if (isLinkedStateClass) {
          this._linkedStateInstance.destroy();
          this._linkedStateInstance = null;
        }
      })();
    }

    render() {
      const passedProps = Object.assign({}, this.state, this.props);

      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <RefForwardedComponent
        ref={c => this._wrappedComponent = c}
        {...passedProps}
      />;
    }

    _handleLinkedStateUpdate = (changedState) => {
      if (typeof stateUpdateFilter === 'function') {
        // Overwrite updatedState w/ filter response
        changedState = stateUpdateFilter(changedState, this._linkedStateInstance) || {};
      }

      if (Object.keys(changedState).length) {      
        this.setState(changedState); 
      }
    }
  };
};

export default hocConnect;