import React, { Component } from 'react';
import ClientProcess, { EVT_TICK } from '../ClientProcess';
import createClientGUIProcessReactComponent from './createClientGUIProcessReactComponent';

export default class ClientGUIProcess extends ClientProcess {
  _base = 'ClientGUIProcess';
  _ReactComponent = null;
  _mountedReactComponent = null;
  _Content = null;
  _isFocused = false;
  _desktopMenubarData = null;
  _renderProps = {};

  constructor(...args) {
    super(...args);

    this._ReactComponent = createClientGUIProcessReactComponent(this,
      /* onMount */ (component) => {
        this.setImmediate(() => {
          this._mountedReactComponent = component;
        });
      },
      
      /* onUnmount */ (component) => {
        this.setImmediate(() => {
          this._mountedReactComponent = null;
        });
      }
    );

    this.on(EVT_TICK, () => {
      // Mount Content, if available
      if (this._Content && this._mountedReactComponent !== null) {
        this._mountedReactComponent.setContent(this._Content);
      }
    });
  }

  /*
  setIcon(iconComponent) {
    this.nextTick();
  }
  */

  /*
  getIcon() {
  }
  */

  /**
   * Sets the UI's upper menubar data, for this process.
   * 
   * @param {object[]} menubarData TODO: Define a structure in comments for this
   */
  setDesktopMenubarData(menubarData) {
    // TODO: Verify integrity of menubarData, throwing error if invalid

    this._desktopMenubarData = menubarData;

    // TODO: Should we utilize a better state handling system here?
    this.nextTick();
  }

  /**
   * Retrieves the UI's upper menubar data, for this process.
   */
  getDesktopMenubarData() {
    return this._desktopMenubarData;
  }

  setReactRenderer(Content) {
    this.setImmediate(() => {
      this._Content = Content;
    });
  }

  /**
   * Alias of this.setReactRenderer().
   */
  setContent(...args) {
    this.setReactRenderer(...args);
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
   * Notifies all listeners that this process is the one the user is
   * interacting with directly.
   * 
   * TODO: Allow optional focus context so we can have independent channels
   * of focus.
   * 
   * Utilizes this.setIsFocused().
   */
  focus() {
    this.setIsFocused(true);
  }

  /**
   * Notifies all listeners that this process is no longer being interacted
   * with directly.
   * 
   * TODO: Allow optional focus context so we can have independent channels
   * of blur.
   * 
   * Utilizes this.setIsFocused().
   */
  blur() {
    this.setIsFocused(false);
  }

  /**
   * Sets whether or not this process' React.Component has top priority in the
   * UI (e.g. if a Window, this Window would be the currently focused Window).
   * 
   * IMPORTANT: Handling of dynamically blurring other instances is not handled
   * directly in here.
   * 
   * @param {boolean} isFocused 
   */
  setIsFocused(isFocused) {
    // Ignore duplicate
    if (this._isFocused === isFocused) {
      console.warn('isFocused is already set to:', isFocused);
      return;
    }

    console.debug(`${isFocused ? 'Focusing' : 'Blurring'} process:`, {
      guiProcess: this,
      nativeProcess: process
    });

    this.setImmediate(() => {
      this._isFocused = isFocused;
    });
  }

  /**
   * Retrieves whether or not this process is currently being interacted with
   * directly by the user.
   * 
   * @return {boolean}
   */
  getIsFocused() {
    return this._isFocused;
  }

  async kill(killSignal = 0) {
    // TODO: Remove the component from the DOM
    console.warn('TODO: Remove the component from the DOM');
    // Note, this is an asynchronous operation...  kill should probably be an async function w/ optional signal

    // Allow view to unset before calling super.kill().
    // TODO: Debug this; Not sure if we should use setImmediate, nextTick, or just pass through
    // this.setImmediate(async () => {
      await super.kill(killSignal);
    // });
  }
}