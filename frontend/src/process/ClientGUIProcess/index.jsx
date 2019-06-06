import React, { Component } from 'react';
import ClientProcess, { EVT_PROCESS_UPDATE } from '../ClientProcess';

export default class ClientGUIProcess extends ClientProcess {
  _base = 'ClientGUIProcess';
  _ReactComponent = null;
  _isFocused = false;
  _desktopMenubarData = null;
  _renderProps = {};

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

    this._isFocused = isFocused;

    // TODO: Should we utilize a better state handling system here?
    this.nextTick();
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

  /*
  setDockIcon(dockIconComponent) {
    this.nextTick();
  }
  */

  /*
  getDockIcon() {
  }
  */

  /**
   * TODO: Rename to setViewComponentProps
   */
  setRenderProps(props) {
    this._renderProps = props;

    console.debug('setting render props', props);

    this.nextTick();
  }

  /**
   * TODO: Rename to setViewComponent
   * 
   * @param {React.Component} Content
   * @return {Promise<boolean>} Resolves to true after the component has been set
   */
  setReactRenderer(Content) {
    const proc = this;

    return new Promise((resolve) => {
      // Using timeout to allow the process to kick to the next cycle
      // Otherwise it will not immediately render to any listeners
      // TODO: Replace w/ nextTick()
      setTimeout(() => {
        // A slight hoc wrapper

        class ReactComponent extends Component {
          componentDidMount() {
            console.warn('TODO: Handle process notification of mount', proc);
          }

          componentWillUnmount() {
            console.warn('TODO: Handle process notification of unmount', proc);
          }

          render() {
            const { ...propsRest } = this;

            if (Content) {
              return (
                <div
                  ref={c => this._el = c}
                  onMouseDown={this._handleDirectInteract}
                  onTouchStart={this._handleDirectInteract}
                  style={{ display: 'inline-block' }}
                >
                  <Content
                    {...propsRest} // Pass all props from hoc
                    key={proc.getPID()}
                  />
                </div>
              );
            } else {
              return null;
            }
          }

          /**
           * Focus process when directly interacted with.
           */
          _handleDirectInteract = (evt) => {
            proc.focus();
          }
        }

        this._ReactComponent = ReactComponent;

        // Let listeners know we have updated the process
        this.nextTick();

        resolve(true);
      }, 0);
    });
  }

  /**
   * Retrieves the component set by this.setReactRenderer().
   * 
   * @return {React.Component} Note the returned React.Component has a 'proc'
   * attribute which represents this ClientGUIProcess instance.
   */
  getReactComponent() {
    return this._ReactComponent;
  }

  kill() {
    // Remove the component from the DOM
    // Note, this is an asynchronous operation...  kill should probably be an async function w/ optional signal
    this.setReactRenderer(null);

    // Allow view to unset before calling super.kill().
    setTimeout(() => {
      super.kill();
    }, 0);
  }
}