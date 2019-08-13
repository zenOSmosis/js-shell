import EventEmitter from 'events';
import AppRuntime from 'core/AppRuntime';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import Window, { EVT_BEFORE_CLOSE } from './Window';

const _appRuntimeLinkedState = new AppRuntimeLinkedState();

/**
 * @extends EventEmitter
 */
class WindowStack extends EventEmitter {
  constructor() {
    super();

    /**
     * An array of Window components.
     * 
     * Note that the order of indexes reflects how they will be positioned.
     * 
     * @type {Window[]}
     */
    this._stack = [];
  }

  /**
   * @return {Window[]}
   */
  getWindowStack() {
    return this._stack;
  }

  getWindowStackIndex(desktopWindow) {
    const currIdx = this._stack.indexOf(desktopWindow);
    if (currIdx === -1) {
      console.warn('desktopWindow is not in the stack');
      return;
    }

    return currIdx;
  }

  /**
   * Focuses a single window.
   * 
   * @param {Window} desktopWindow 
   */
  focusWindow(desktopWindow) {
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow is not a Window instance');
    }

    // Move window to the top of stack
    const currIdx = this.getWindowStackIndex(desktopWindow);
    
    // Temporarily Remove from stack
    this._stack.splice(currIdx, 1);

    // Push to the end of the stack
    this._stack.push(desktopWindow);

    // Set focused app runtime in LinkedState
    const appRuntime = desktopWindow.getAppRuntimeIfExists();
    if (appRuntime) {
      _appRuntimeLinkedState.setFocusedAppRuntime(appRuntime);
    }
    
    this.renderStack();
  }

  /**
   * Brings all connected windows to the given AppRuntime to the front.
   * 
   * @param {AppRuntime} appRuntime 
   */
  bringAppRuntimeWindowsToFront(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime is not an AppRuntime instance');
    }

    // Locate all windows for the desktopWindow AppRuntime
    const appRuntimeWindows = this.getAppRuntimeWindows(appRuntime);

    // Push them all to the top of the stack, in the current order
    const lenAppRuntimeWindows = appRuntimeWindows.length;
    for (let i = 0; i < lenAppRuntimeWindows; i++) {
      const currWindow = appRuntimeWindows[i];
      const currIdx = this.getWindowStackIndex(currWindow);
      
      // Temporarily Remove from stack
      this._stack.splice(currIdx, 1);
      
      // Push to the end of the stack
      this._stack.push(currIdx);
    }

    this.renderStack();
  }

  /**
   * 
   * @param {AppRuntime} appRuntime
   * @return {Window[]}
   */
  getAppRuntimeWindows(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime is not an AppRuntime instance');
    }

    const lenStack = this._stack.length;

    const appRuntimeWindows = [];

    for (let i = 0; i < lenStack; i++) {
      const desktopWindow = this._stack[i];
    
      const testAppRuntime = desktopWindow.getAppRuntimeIfExists();

      if (Object.is(testAppRuntime, appRuntime)) {
        appRuntimeWindows.push(desktopWindow);
      }
    }

    return appRuntimeWindows;
  }

  /**
   * Applies zIndexes on the underlying Window stack, and applies focus() /
   * blur() to each Window, depending on where they are in the stack.
   * 
   * The Window with the highest stack index (0 is lowest), will become the
   * focused Window, while all others are blurred.
   */
  renderStack() {
    const lenStack = this._stack.length;

    for (let i = 0; i < lenStack; i++) {
      const testWindow = this._stack[i];
    
      // Apply relevant z-indexes (to visually render them)
      testWindow.setZIndex(i * 1000);
    
      
      if (i < lenStack - 1) {
        // Blur other windows
        testWindow.blur();
      } else {
        // Focus hightest window
        testWindow.focus();
      }
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

    // Handle window close cleanup
    desktopWindow.on(EVT_BEFORE_CLOSE, () => {
      this._removeWindow(desktopWindow);
    });

    this._stack.push(desktopWindow);
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

    this._stack = this._stack.filter(testWindow => {
      return testWindow !== desktopWindow
    });
  }
};

export default WindowStack;