import React, { Component } from 'react';
import ClientGUIProcess from './ClientGUIProcess';
import './ClientGUIProcess.typedef';

/**
 * Dynamically creates a ClientGUIProcessReactComponent class as a HOC using
 * the given ClientGUIProcess.
 * 
 * Note: This is dynamically created as a HOC component in order to use the
 * resulting component as a <ClientGUIProcessReactComponent /> tag.
 * 
 * @param {GUIProcessReactComponentParams} procParams 
 */
const createClientGUIProcessReactComponent = (procParams) => {
  const { guiProc, onMount, onUnmount, onDirectInteract } = procParams;

  if (!(guiProc instanceof ClientGUIProcess)) {
    throw new Error('guiProc must be a ClientGUIProcess instance');
  }

  const pid = guiProc.getPID();

  /**
   * React rendering component for ClientGUIProcess instances.
   */
  class ClientGUIProcessReactComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        Content: null
      };

      if (typeof onDirectInteract !== 'function') {
        console.warn('onDirectInteract not available as a function');
      }

      this._Content = null;
      this._isMounted = false;
    }

    componentDidMount() {
      this._isMounted = true;

      if (typeof onMount === 'function') {
        onMount(this);
      }
    }

    componentWillUnmount() {
      this._isMounted = false;

      if (typeof onUnmount === 'function') {
        onUnmount(this);
      }
    }

    /**
     * Sets internal content of this class.
     * 
     * @param {Component} Content 
     */
    setView(Content) {
      if (!this._isMounted) {
        console.warn('Ignoring setView() call on unmounted ClientGUIProcess component');
        return;
      }

      // console.warn('TODO: Verify the integrity of the content');

      this.setState({
        Content
      });
    }

    /**
     * Replaces the content w/ an empty div tag.
     */
    empty() {
      this.setView(() => {
        return (
          <div></div>
        );
      });
    }

    render() {
      const {
        ...propsRest
      } = this;

      const { Content } = this.state;

      return (
        <div
          // ref={c => this._el = c}
          onMouseDown={onDirectInteract}
          onTouchStart={onDirectInteract}
          style={{ display: 'inline-block' }}

          data-proc-pid={pid} // For debugging
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