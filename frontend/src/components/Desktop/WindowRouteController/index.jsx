import React, { Component } from 'react';
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import { withRouter } from 'react-router';
import redirectTo from 'utils/desktop/redirectTo';
import setBrowserTitle from 'utils/desktop/setBrowserTitle';
import titleToURI from 'utils/desktop/titleToURI';

/**
 * Window / URI mapping
 */
const {setWindowRouteKey, getWindowRouteKey} = (() => {
  console.warn('TODO: Fix window / URI pairing');

  let _windowRouteKeymaps = [];
  const setWindowRouteKey = (window, routeKey) => {
    const existing = getWindowRouteKey(window);
    if (!existing) {
      _windowRouteKeymaps.push({
        window,
        routeKey
      });
    }
  };
  const getWindowRouteKey = (window) => {
    if (!_windowRouteKeymaps.length) {
      return;
    }
    
    const keyMap = _windowRouteKeymaps.reduce((a, b) => {
      if (Object.is(a.window, window)) {
        return a;
      }
      if (Object.is(b.window, window)) {
        return b;
      }
      return undefined;
    });
  
    console.debug('all keymaps:', _windowRouteKeymaps);
  
    if (keyMap) {
      const {routeKey} = keyMap;
      return routeKey;
    }
  };

  return {
    setWindowRouteKey,
    getWindowRouteKey
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

    this.handleRouteUpdate();
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
        // TODO: Listen to a LinkedState, instead of this
        const {title} = activeWindow.state;

        // Set browser URI bar
        redirectTo(titleToURI(title));
        
        setBrowserTitle(title);

        console.debug('Active window route key', getWindowRouteKey(activeWindow));
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleRouteUpdate();
    }
  }

  handleRouteUpdate() {
    const {location} = this.props;

    if (location) {
      console.debug('ROUTE CHANGED', location, this.props.history);
      
      const {key: routeKey} = location;

      if (this._activeWindow) {
        setWindowRouteKey(this._activeWindow, routeKey);
      }
    }
  }

  _handleDesktopLinkedStateUpdate = (updatedState) => {
    console.warn('TODO: Handle WindowRouteController DesktopLinkedState update');

    const {activeWindow} = updatedState;
    if (activeWindow) {
      this.handleActiveWindowUpdate(activeWindow);
    }
  }

  render() {
    // An empty, and invisible, element
    return (
      <div style={{display: 'none'}}></div>
    );
  }
}

export default withRouter(WindowRouteController);