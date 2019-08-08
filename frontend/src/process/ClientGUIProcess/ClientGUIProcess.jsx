// import React, { Component } from 'react';
import ClientProcess, { EVT_TICK, EVT_BEFORE_EXIT } from '../ClientProcess';
// import ClientGUIProcessMenubar from './ClientGUIProcessMenubar';
import createClientGUIProcessReactComponent from './_createClientGUIProcessReactComponent';
import './GUIProcessReactComponentParams.typedef';

// Emits the first time the process' React component renders
export const EVT_FIRST_RENDER = 'firstRender';

export {
  EVT_TICK,
  EVT_BEFORE_EXIT
};

/**
 * TODO: Document
 * 
 * @extends ClientProcess
 */
class ClientGUIProcess extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._isGUIProcess = true;
    
    // Wrapping ReactComponent view
    this._ReactComponent = null;
    this._mountedReactComponent = null; // TODO: Rename to wrappedReactComponent, or something similar
    this._viewProps = {}; // Serves as a cache until the component is mounted

    // Externally set view (used by this.setView())
    this._View = null;
    
    this._isFocused = false;
    this._desktopMenubarData = null; 
    this._renderProps = {};

    this._ReactComponent = createClientGUIProcessReactComponent({
      guiProc: this,

      onMount: (component) => {
        this._mountedReactComponent = component;

        this.setViewProps(this._viewProps);
      },

      onUnmount: () => {
        this._mountedReactComponent = null;
      }
    });

    this.on(EVT_TICK, () => {
      // Mount View, if available, and not already mounted
      if (this._View && this._mountedReactComponent !== null) {
        this._mountedReactComponent.setView(this._View);
      }
    });
  }

  /**
   * TODO: Document
   * 
   * @param {React.Component} View 
   */
  setView(View) {
    let firstRender = false;
    
    if (!this._View) {
      firstRender = true;
    }

    this.setImmediate(() => {
      this._View = View;

      if (firstRender) {
        this.emit(EVT_FIRST_RENDER);
      }
    });
  }

  /**
   * TODO: Document
   * 
   * @param {Object} viewProps 
   */
  setViewProps(viewProps) {
    const currentViewProps = this._viewProps;

    const mergedViewProps = {...currentViewProps, ...viewProps};

    this._viewProps = mergedViewProps;

    if (this._mountedReactComponent) {
      this._mountedReactComponent.setViewProps(viewProps);  
    }
  }

  /**
   * Retrieves the wrapping React component which represents this process.
   * 
   * @return {React.Component} Note the returned React.Component has a 'proc'
   * attribute which represents this ClientGUIProcess instance.
   */
  getReactComponent() {
    return this._ReactComponent;
  }

  /**
   * Unmounts the view and exits the process.
   * 
   * @param {number} exitSignal
   * @return {Promise<void>}
   */
  async exit(exitSignal = 0) {
    try {
      if (this._mountedReactComponent) {
        this._mountedReactComponent.empty();
      }
  
      // Note, this is an asynchronous operation...  exit should probably be an async function w/ optional signal
  
      // Allow view to unset before calling super.exit().
      // TODO: Debug this; Not sure if we should use setImmediate, nextTick, or just pass through
      // this.setImmediate(async () => {
      await super.exit(exitSignal);
      // }); 
    } catch (exc) {
      throw exc;
    }
  }
}

export default ClientGUIProcess;