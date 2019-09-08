import React, { Component, Fragment } from 'react';
import ClientGUIProcess from './ClientGUIProcess';
import './GUIProcessReactComponentParams.typedef';

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
  const { guiProc, onMount, onUnmount } = procParams;

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
        Content: null,
        viewProps: {} // Props for the wrapped view
      };

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

    setViewProps(viewProps) {
      const { viewProps: currentViewProps } = this.state;

      const mergedViewProps = {...currentViewProps, ...viewProps};

      this.setState({
        viewProps: mergedViewProps
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
      /*
      const {
        ...propsRest
      } = this;
      */

      const { Content } = this.state;

      const { viewProps: stateViewProps } = this.state;
      const wrappedViewProps = {...this.props, ...stateViewProps};

      return (
        <Fragment>
          {
            Content &&
            <Content
              {...wrappedViewProps} // Pass all props from hoc
            />
          }
        </Fragment>
      );
    }
  }

  return ClientGUIProcessReactComponent;
};

export default createClientGUIProcessReactComponent;