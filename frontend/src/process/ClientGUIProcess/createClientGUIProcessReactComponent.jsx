import React, { Component } from 'react';
import ClientGUIProcess from './ClientGUIProcess';

/**
 * Dynamically creates a ClientGUIProcessReactComponent class using the given
 * ClientGUIProcess.
 * 
 * Note: This is dynamically created as a HOC component in order to use the
 * resulting component as a <ClientGUIProcessReactComponent /> tag.
 * 
 * @param {ClientGUIProcess} proc 
 */
const createClientGUIProcessReactComponent = (proc, onMount, onUnmount) => {
  if (!(proc instanceof ClientGUIProcess)) {
    throw new Error('proc must be a ClientGUIProcess instance');
  }

  /**
   * React rendering component for ClientGUIProcess instances.
   */
  class ClientGUIProcessReactComponent extends Component {
    state = {
      Content: null
    };

    constructor(props) {
      super(props);

      if (typeof props.handleDirectInteract !== 'function') {
        console.warn('handleDirectInteract not available as a function');
      }

      this._Content = null;
      this._isMounted = false;
    }

    componentDidMount() {
      this._isMounted = true;

      console.warn('TODO: Handle process notification of mount', this._proc);

      if (typeof onMount === 'function') {
        onMount(this);
      }
    }

    componentWillUnmount() {
      this._isMounted = false;

      console.warn('TODO: Handle process notification of unmount', this._proc);

      if (typeof onUnmount === 'function') {
        onUnmount(this);
      }
    }

    /**
     * Sets internal content of this class.
     * 
     * @param {Component} Content 
     */
    setContent(Content) {
      // console.warn('TODO: Verify the integrity of the content');

      this.setState({
        Content
      });
    }

    render() {
      const {
        handleDirectInteract,
        ...propsRest
      } = this;

      const { Content } = this.state;

      return (
        <div
          // ref={c => this._el = c}
          onMouseDown={handleDirectInteract}
          onTouchStart={handleDirectInteract}
          style={{ display: 'inline-block' }}
          data-proc-pid={proc.getPID()}
        >
          {
            Content &&
            <Content
              {...propsRest} // Pass all props from hoc
            />
          }
        </div>
      );
    }
  }

  return ClientGUIProcessReactComponent;
};

export default createClientGUIProcessReactComponent;