import React, { Component } from 'react';
import { EVT_LINKED_STATE_UPDATE } from '../LinkedState';

/**
 * Connects LinkedState (or derivative) to a React component's lifecycle.
 *
 * @see https://reactjs.org/docs/higher-order-components.html
 * 
 * @param {Component} WrappedComponent 
 * @param {LinkedState} LinkedState A passed LinkeState class, or extension of.
 * @param {Function} stateUpdateFilter [default = null] Applies this filtered
 * value to the component props when the state is updated.
 */
const hocConnect = (WrappedComponent, LinkedState, stateUpdateFilter = null, onConstruct = null) => {
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

  // ...and returns another component...
  return class extends Component {
    constructor(props) {
      if (!WrappedComponent) {
        throw new Error('Missing WrappedComponent.  A React Component must be specified to be wrapped.');
      }

      super(props);

      this._linkedStateInstance = null;
    }

    componentDidMount() {
      // Register LinkedState connection
      (() => {
        if (this._linkedStateInstance) {
          console.warn('LinkedState instance is already set');
          return;
        }

        this._linkedStateInstance = new LinkedState();

        if (!this._linkedStateInstance) {
          throw new Error('No LinkedState present');
        }

        this._linkedStateInstance.on(EVT_LINKED_STATE_UPDATE, this._handleLinkedStateUpdate);

        const state = this._linkedStateInstance.getState();

        // Set initial state
        this._handleLinkedStateUpdate(state);

        if (typeof onConstruct === 'function') {
          onConstruct({
            component: this._wrappedComponent,
            linkedState: this._linkedStateInstance
          });
        }
      })();
    }

    componentWillUnmount() {
      // Unregister LinkedState connection
      (() => {
        this._linkedStateInstance.off(EVT_LINKED_STATE_UPDATE, this._handleLinkedStateUpdate);

        this._linkedStateInstance.destroy();
        this._linkedStateInstance = null;
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
        const fullState = this._linkedStateInstance.getState();

        // Overwrite updatedState w/ filter response
        changedState = stateUpdateFilter(changedState, fullState) || {};
      }

      if (Object.keys(changedState).length) {      
        this.setState(changedState); 
      }
    }
  };
};

export default hocConnect;