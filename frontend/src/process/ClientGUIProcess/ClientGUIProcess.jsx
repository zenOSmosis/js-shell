// import React, { Component } from 'react';
import ClientProcess, { EVT_TICK, EVT_BEFORE_EXIT } from '../ClientProcess';
// import ClientGUIProcessMenubar from './ClientGUIProcessMenubar';
import createClientGUIProcessReactComponent from './createClientGUIProcessReactComponent';
import './ClientGUIProcess.typedef';

// Emits the first time the process' React component renders
export const EVT_FIRST_RENDER = 'firstRender';

export const EVT_DIRECT_INTERACT = 'directInteract';

export {
  EVT_TICK,
  EVT_BEFORE_EXIT
};

export default class ClientGUIProcess extends ClientProcess {
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
      },
      
      onDirectInteract: (evt) => {
        console.warn('TODO: Re-enable evt propagation for onDirectInteract, but only call onDirectInteract on highest child');
        evt.stopPropagation();

        this.emit(EVT_DIRECT_INTERACT);
      }
    });

    this.on(EVT_TICK, () => {
      // Mount View, if available, and not already mounted
      if (this._View && this._mountedReactComponent !== null) {
        this._mountedReactComponent.setView(this._View);
      }
    });
  }

  // TODO: Rename to setMainView
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

  // TODO: Rename to setMainViewProps
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

  async kill(killSignal = 0) {
    try {
      if (this._mountedReactComponent) {
        this._mountedReactComponent.empty();
      }
  
      // Note, this is an asynchronous operation...  kill should probably be an async function w/ optional signal
  
      // Allow view to unset before calling super.kill().
      // TODO: Debug this; Not sure if we should use setImmediate, nextTick, or just pass through
      // this.setImmediate(async () => {
      await super.kill(killSignal);
      // }); 
    } catch (exc) {
      throw exc;
    }
  }
}