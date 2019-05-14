import React, { Component } from 'react';
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import { withRouter } from 'react-router';
import redirectTo from 'utils/desktop/redirectTo';
import setBrowserTitle from 'utils/desktop/setBrowserTitle';
import titleToURI from 'utils/desktop/titleToURI';

/**
 * Window / URI mapping
 */
const {setWindowRouteKey, getWindowWithRouteKey} = (() => {
  console.warn('TODO: Fix window / URI pairing');

  let _windowRouteKeymaps = [];
  
  const setWindowRouteKey = (window, routeKey) => {
    // Ensure routeKey doesn't already point to an existing window
    const existing = getWindowWithRouteKey(routeKey);
    if (existing) {
      console.warn('Window already exists with route key', routeKey);
      return;
    }

    _windowRouteKeymaps.push({
      window,
      routeKey
    });
  }

  const getWindowWithRouteKey = (routeKey) => {
    if (!_windowRouteKeymaps.length) {
      return;
    }

    for (let i = 0; i < _windowRouteKeymaps.length; i++) {
      const keyMap = _windowRouteKeymaps[i];
      
      if (keyMap.routeKey === routeKey) {
        return keyMap.window;
      }
    }
  };

  return {
    setWindowRouteKey,
    getWindowWithRouteKey
  };
})();

let _isInstantiated = false;

/**
 * A controller component which has 3 main purposes:
 * 
 * 1. Updates browser title when an aribtrary window is activated
 * 2. Sets the URL location of the Desktop when a window is activated
 * 2. Listens to URL location (via React Router) and activates corresponding
 * window, if present, or generates an error window.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
class WindowRouteController extends Component {
  _activeWindow = null;

  constructor(props = {}) {
    if (_isInstantiated) {
      throw new Error('WindowDrawLayer is already instantiated');
    }
    
    super(props);

    this._desktopLinkedState = new DesktopLinkedState();

    _isInstantiated = true;
  }

  componentDidMount() {
    this._desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, this._handleDesktopLinkedStateUpdate);

    this.handleLocationChange();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleLocationChange();
    }
  }

  componentWillUnmount() {
    this._desktopLinkedState.off(EVT_LINKED_STATE_UPDATE, this._handleDesktopLinkedStateUpdate);
  }

  handleActiveWindowUpdate(activeWindow) {
    if (activeWindow) {
      this._activeWindow = activeWindow;

      // TODO: Remove
      console.debug('active window', activeWindow);

      // A setTimeout is used here because the window's title may not be set
      // immediately when activated
      //
      // TODO: Consider reworking when the active window's title has been set
      // in order to minimize the risk of this happening
      setTimeout(() => {
        // TODO: Listen to a LinkedState, instead of activeWindow.state
        const {title} = activeWindow.state;

        // Set browser URI bar
        redirectTo(titleToURI(title));
        
        setBrowserTitle(title);
      }, 0);
    }
  }

  /**
   * Automatically executed when the browser's URL changes.
   */
  handleLocationChange() {
    const {location} = this.props;

    if (location) {
      // TODO: Remove
      console.debug('ROUTE CHANGED', location, this.props.history);
      
      const {key: routeKey} = location;

      if (this._activeWindow) {
        // Determine if current location hash points to currently active window
        const winWithRouteKey = getWindowWithRouteKey(routeKey);

        if (winWithRouteKey) {
          // If it points to a different window, activate that window
          if (!Object.is(this._activeWindow, winWithRouteKey)) {
            winWithRouteKey.activate();
          }
        } else {
          // If it doesn't point to a window, register current location hash to currently active window
          setWindowRouteKey(this._activeWindow, routeKey);
        }

        // console.debug('Win with route key', routeKey, getWindowWithRouteKey(routeKey));
      }
    }
  }

  render() {
    // An empty, and invisible, element
    return (
      <div style={{display: 'none'}}></div>
    );
  }

  /**
   * "Privatized" as it uses an arrow function.
   */
  _handleDesktopLinkedStateUpdate = (updatedState) => {
    const {activeWindow} = updatedState;
    if (activeWindow) {
      this.handleActiveWindowUpdate(activeWindow);
    }
  }
}

export default withRouter(WindowRouteController);