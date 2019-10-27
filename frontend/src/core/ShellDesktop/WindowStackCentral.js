// TODO: Prevent Windows from being positioned outside of viewable area
// (or snap back after positioning)

import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import { getShellDesktopProcess } from '../ShellDesktop';
import AppRegistration from '../AppRegistration';
import AppRuntime, { EVT_FOCUS as EVT_APP_RUNTIME_FOCUS } from '../AppRuntime';
import Window, {
  EVT_MOUNT,
  EVT_BEFORE_CLOSE,
  EVT_FOCUS
} from 'components/Desktop/Window';
import DesktopWindowLinkedState from 'state/DesktopWindowLinkedState';

let _windowStackCentral = null;

/**
 * Window Stack Central manages the entire Window stack.
 * 
 * @extends ClientProcess
 */
class WindowStackCentral extends ClientProcess {
  // Default offset of where to place the next Window, relevant to the previous
  // Window
  static nextDefaultPositionOffset = {
    x: 20,
    y: 20
  };

  constructor(...args) {
    if (_windowStackCentral) {
      throw new Error('Another WindowStackCentral already exists!');
    }

    super(...args);

    // Register process flag
    _windowStackCentral = this;

    this.setTitle('Window Stack Central');
  
    /**
     * An array of Window components.
     * 
     * Note that the order of indexes reflects how they will be positioned.
     * 
     * @type {Window[]}
     */
    this._windowStack = [];

    this._shellDesktopProcess = getShellDesktopProcess();

    // Blur all windows when Shell Desktop aquires focus
    (() => {
      const _handleShellDesktopFocus = () => {
        this.blurAllWindows();
      };

      this._shellDesktopProcess.on(EVT_APP_RUNTIME_FOCUS, _handleShellDesktopFocus);
      this.on(EVT_BEFORE_EXIT, () => {
        this._shellDesktopProcess.off(EVT_APP_RUNTIME_FOCUS, _handleShellDesktopFocus);
        this._shellDesktopProcess = null;
      });
    })();

    this._desktopWindowLinkedState = new DesktopWindowLinkedState();

    /**
     * If no position information is stored for the Window, this value will be
     * used for the Window position.  It is updated internally per each Window.
     * 
     * @type {WindowPosition}
     */
    this._nextDefaultPosition = {
      x: 0,
      y: 0
    };
  }

  incrementNextDefaultPosition() {
    let { x, y } = this._nextDefaultPosition;
    const { x: offsetX, y: offsetY } = WindowStackCentral.nextDefaultPositionOffset;

    // Apply offsets
    x += offsetX;
    y += offsetY;

    this._nextDefaultPosition = {
      x,
      y
    };
  }

  /**
   * @return {Window[]}
   */
  getWindowStack() {
    return this._windowStack;
  }

  /**
   * 
   * @param {number} desktopWindow 
   */
  getWindowStackIndex(desktopWindow) {
    for (let i = 0; i < this._windowStack.length; i++) {
      const testWindow = this._windowStack[i];

      if (Object.is(testWindow, desktopWindow)) {
        return i;
      }
    }

    console.warn('desktopWindow is not in the stack');
  }

  bringSubWindowStackToTop(desktopWindows) {
    // Push them all to the top of the stack, in the current order
    const lenDesktopWindows = desktopWindows.length;
    for (let i = 0; i < lenDesktopWindows; i++) {
      const currWindow = desktopWindows[i];

      const currIdx = this.getWindowStackIndex(currWindow);

      if (currIdx === -1) {
        continue;
      }
      
      // Temporarily remove from stack
      this._windowStack.splice(currIdx, 1);
      
      // Push to the end of the stack
      this._windowStack.push(currWindow);
    }

    this.renderStack();
  }

  /**
   * @param {AppRegistration} appRegistration 
   */
  bringAppRegistrationWindowsToFront(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new Error('appRegistration is not an AppRegistration instance');
    }

    // Locate all windows for the desktopWindow AppRuntime
    const appRegistrationWindows = this.getJoinedAppRegistrationWindows(appRegistration);

    this.bringSubWindowStackToTop(appRegistrationWindows);
  }

  /**
   * Brings all connected windows to the given AppRuntime to the top of the
   * stack, then renders them.
   * 
   * @param {AppRuntime} appRuntime 
   */
  bringAppRuntimeWindowsToFront(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime is not an AppRuntime instance');
    }

    // Locate all windows for the desktopWindow AppRuntime
    const appRuntimeWindows = this.getJoinedAppRuntimeWindows(appRuntime);

    this.bringSubWindowStackToTop(appRuntimeWindows);
  }

  /**
   * Retrieves Window components connected to the given AppRuntime.
   * 
   * @param {AppRuntime} appRuntime
   * @return {Window[]}
   */
  getJoinedAppRuntimeWindows(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime is not an AppRuntime instance');
    }

    const appRegistration = appRuntime.getAppRegistration();

    return this.getJoinedAppRegistrationWindows(appRegistration);
  }

  /**
   * Retrieves Window components connected to the given AppRegistration.
   * 
   * @param {AppRegistration} appRegistration
   * @return {Window[]}
   */
  getJoinedAppRegistrationWindows(appRegistration) {
    /**
     * @type {AppRuntime[]}
     */
    const joinedAppRuntimes = appRegistration.getJoinedAppRuntimes();
    const lenJoinedAppRuntimes = joinedAppRuntimes.length;

    const joinedAppRuntimeWindows = [];
    
    for (let i = 0; i < lenJoinedAppRuntimes; i++) {
      const currAppRuntime = joinedAppRuntimes[i];
      const currWindow = currAppRuntime.getWindowIfExists();

      if (currWindow) {
        joinedAppRuntimeWindows.push(currWindow);
      }
    }

    return joinedAppRuntimeWindows;
  }

  /**
   * Applies zIndexes on the underlying Window stack, and applies focus() /
   * blur() to each Window, depending on where they are in the stack.
   * 
   * The Window with the highest stack index (0 is lowest), will become the
   * focused Window, while all others are blurred.
   */
  renderStack() {
    const lenStack = this._windowStack.length;

    for (let i = 0; i < lenStack; i++) {
      const testWindow = this._windowStack[i];

      if (!testWindow) {
        console.error('Skipping non-Window @', {
          i,
          stack: this._windowStack
        });

        continue;
      }
    
      // Apply relevant z-indexes (to visually render them)
      testWindow.setZIndex(i);
      
      if (i < lenStack - 1) {
        // Blur other windows
        testWindow.blur();
      } else {
        // Focus highest zIndex window
        testWindow.focus();
      }
    }
  }

  blurAllWindows() {
    const lenDesktopWindows = this._windowStack.length;

    for (let i = 0; i < lenDesktopWindows; i++) {
      this._windowStack[i].blur();
    }
  }

  /**
   * Handles blur / focus of a single Window.
   * 
   * IMPORTANT! This is internally called once the Window emits an EVT_FOCUS
   * or an EVT_BLUR event.
   * 
   * @param {Window} desktopWindow 
   */
  _handleWindowFocus = (desktopWindow) => {
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow is not a Window instance');
    }

    this.bringSubWindowStackToTop([desktopWindow]);

    // Set focused app runtime in LinkedState
    const appRuntime = desktopWindow.getAppRuntimeIfExists();
    if (appRuntime) {
      // const isFocused = desktopWindow.getIsFocused();

      appRuntime.setIsFocused(true);
    }
  }

  /**
   * IMPORTANT! This should be set internally by a Window component's lifecycle,
   * and not anywhere else.
   * 
   * @param {Window} desktopWindow 
   */
  _addWindow(desktopWindow) {
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow is not a Window instance');
    }

    this._windowStack.push(desktopWindow);

    // Set on next tick, so that the Window can fully set for any initial listeners
    this.setImmediate(() => {
      this._desktopWindowLinkedState.addWindow(desktopWindow);
    });

    // Apply Window position once mounted
    desktopWindow.once(EVT_MOUNT, () => {
      desktopWindow.setPosition(this._nextDefaultPosition);
      this.incrementNextDefaultPosition();

      // Render w/ zIndexes
      this.renderStack();
    });

    desktopWindow.on(EVT_FOCUS, () => {
      this._handleWindowFocus(desktopWindow);
    });

    // Handle window close cleanup
    desktopWindow.once(EVT_BEFORE_CLOSE, () => {
      this._removeWindow(desktopWindow);
    });
  }

  /**
   * IMPORTANT! This should be set internally by a Window component's lifecycle,
   * and not anywhere else.
   * 
   * @param {Window} desktopWindow 
   */
  _removeWindow(desktopWindow) {
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow is not a Window instance');
    }

    this._windowStack = this._windowStack.filter(testWindow => {
      return !Object.is(testWindow, desktopWindow);
    });

    this._desktopWindowLinkedState.removeWindow(desktopWindow);

    // Render the updated stack, or there will be problems with auto Window
    // focusing after closing other Windows, etc.
    this.renderStack();
  }
}

//

/**
 * @return {AppLaunchController} A constructed instance of the
 * AppLaunchController
 */
const getWindowStackCentral = () => {
  if (!_windowStackCentral) {
    throw new Error('No Window Stack Central defined');
  }

  return _windowStackCentral;
};

export default WindowStackCentral;
export {
  getWindowStackCentral
};