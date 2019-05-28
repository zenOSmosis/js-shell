import React from 'react';
import ClientProcess, { EVT_PROCESS_UPDATE } from '../ClientProcess';

// Only one ClientGUIProcess can be focused at once for user interactivity
let _focusedClientGUIProcess = null;
export const getFocusedClientGUIProcess = () => {
  return _focusedClientGUIProcess;
};

export default class ClientGUIProcess extends ClientProcess {
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
   * TODO: Allow optional focus context so we can have independent channels
   * of focus.
   * 
   * @param {boolean} isFocused 
   */
  setIsFocused(isFocused) {
    this._isFocused = isFocused;

    _focusedClientGUIProcess = this;

    // TODO: Should we utilize a better state handling system here?
    this.emit(EVT_PROCESS_UPDATE);
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
    this.emit(EVT_PROCESS_UPDATE);
  }

  /**
   * Retrieves the UI's upper menubar data, for this process.
   */
  getDesktopMenubarData() {
    return this._desktopMenubarData;
  }

  /**
   * TODO: Rename to setViewComponentProps
   */
  setRenderProps(props) {
    this._renderProps = props;

    console.debug('setting render props', props);

    this.emit(EVT_PROCESS_UPDATE);
  }
 
  /**
   * TODO: Rename to setViewComponent
   * 
   * @param {React.Component} Content
   * @return {Promise<boolean>} Resolves to true after the component has been set
   */
  setReactRenderer(Content) {
    return new Promise((resolve) => {
      // Using timeout to allow the process to kick to the next cycle
      // Otherwise it will not immediately render to any listeners
      // TODO: Replace w/ nextTick()
      setTimeout(() => {
        // A slight hoc wrapper
        // TODO: Should this be converted into a class w/ a monitorable view cycle?
        this._ReactComponent = (props = {}) => {
          return (
            <Content
              {...props} // Pass all props from hoc
              key={this.getPID()}
            />
          )
        }

        // Let listeners know we have updated the process
        this.emit(EVT_PROCESS_UPDATE);

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
}