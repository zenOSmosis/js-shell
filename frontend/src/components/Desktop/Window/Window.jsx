// TODO: Enable optional debugger:  https://github.com/redsunsoft/react-render-visualizer

// TODO: Implement https://www.npmjs.com/package/prop-types

import React, { Component } from 'react';
import WindowHeader from './Header';
import ContextMenu from 'components/ContextMenu';
import Cover from 'components/Cover';
import DragResizable from 'components/DragResizable';
import ErrorBoundary from 'components/ErrorBoundary';
import Moveable from 'components/Moveable';
import StackingContext from 'components/StackingContext';
import './style.css';
import AppRuntime from 'core/AppRuntime';
import DesktopLinkedState from 'state/DesktopLinkedState';
import { ANIMATE_JACK_IN_THE_BOX, ANIMATE_ZOOM_OUT, ANIMATE_ZOOM_IN } from 'utils/animate';
import animate from 'utils/animate'; // TODO: Debug why this doesn't work on Windows
import PropTypes from 'prop-types';
import _WindowStack from './_WindowStack';

import config from 'config';
import $ from 'jquery';
import uuidv4 from 'uuid/v4';
const { DESKTOP_UNTITLED_WINDOW_DEFAULT_TITLE, DESKTOP_WINDOW_MIN_WIDTH, DESKTOP_WINDOW_MIN_HEIGHT } = config;

const EFFECT_CREATE = ANIMATE_JACK_IN_THE_BOX;
const EFFECT_MINIMIZE = ANIMATE_ZOOM_OUT;
const EFFECT_RESTORE = ANIMATE_ZOOM_IN;

// Begin exported events ***********
//
// Though exporting events aren't typical in React components, this provides an
// alternative interface for external hooks

export const EVT_BEFORE_CLOSE = 'beforeClose';
export const EVT_CLOSE = 'close';

export const EVT_BEFORE_TITLE_SET = 'beforeTitleSet';
export const EVT_TITLE_SET = 'titleSet';

export const EVT_BEFORE_FOCUS = 'beforeFocus';
export const EVT_FOCUS = 'focus';

export const EVT_BEFORE_BLUR = 'beforeBlur';
export const EVT_BLUR = 'blur';

export const EVT_BEFORE_HIDE = 'beforeHide';
export const EVT_HIDE = 'hide';

export const EVT_BEFORE_UNHIDE = 'beforeUnhide';
export const EVT_UNHIDE = 'unhide';

export const EVT_BEFORE_MINIMIZE = 'beforeMinimize';
export const EVT_MINIMIZE = 'minimize';

export const EVT_BEFORE_MAXIMIZE = 'willMaximize';
export const EVT_MAXIMIZE = 'maximize';

export const EVT_BEFORE_RESIZE = 'beforeResize';
export const EVT_RESIZE = 'resize';

// End Exported events ***********

const CSS_CLASS_NAME_FOCUS = 'focus';
const CSS_CLASS_NAME_HIDE = 'hide';

// The CSS z-index level the next focused Window will have
// This value is automatically incremented internally
// let _nextZIndex = 0;

// An array of windows
// let _windowStack = [];

/**
 * TODO: Refactor elsewhere
 * TODO: Implement always-on-top
 * 
 * @return {Window[]} An array of Window instances
 */
/*
export const getWindowStack = () => {
  return _windowStack.filter((window) => {
    return !window.getIsClosed();
  });
}
*/

const _desktopLinkedState = new DesktopLinkedState();
const _windowStack = new _WindowStack();

// Handle blurring of non-focused windows
// Only a single window can be "active" at a time (that is, the focused window)
// TODO: Move all stack management to Core Window Stack Manager
/*
(() => {
  _desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
    const { activeWindow } = updatedState;

    if (typeof activeWindow !== 'undefined') {
      const _windowStack = getWindowStack();

      _windowStack.forEach((desktopWindow) => {
        const isFocusedWindow = Object.is(activeWindow, desktopWindow);

        if (!isFocusedWindow) {
          desktopWindow.blur();
        }
      });
    }
  });
})();
*/

export default class Window extends Component {
  static propTypes = {
    // Optional
    appRuntime: PropTypes.instanceOf(AppRuntime)
  };
  
  constructor(props) {
    super(props);

    this.state = {
      title: null
    };

    this._events = new EventEmitter();

    // Apply stack management to the Window
    _windowStack._addWindow(this);

    this._uuid = uuidv4();

    // Base DOM element for the Window
    this._el = null;

    // TODO: Move this out of constructor
    // this._app = this.props.app;
    // TODO: Use contant here
    /*
    this._app.on('focus', () => {
      this.focus();
    });
    */
    this._moveableComponent = null;
    this._resizableComponent = null;
    this._paintedComponent = null;
    this._windowHeaderComponent = null;
    this._windowBodyComponent = null;
    this._bodyCoverComponent = null;

    this._isMinimized = false;
    this._isMaximized = false;
    this._isFocused = false;
    this._isActiveHeaderGesture = false;
    this._isResizing = false;

    this._isClosing = false;
    this._isClosed = false;

    // Add this window to the stack
    // _windowStack.push(this);
  }

  emit(...args) {
    if (this._events) {
      this._events.emit(...args);
    }
  }

  on(...args) {
    if (this._events) {
      this._events.on(...args);
    }
  }

  off(...args) {
    if (this._events) {
      this._events.off(...args);
    }
  }

  once(...args) {
    if (this._events) {
      this._events.once(...args);
    }
  }

  async componentDidMount() {
    try {
      /*
      if (this._isClosed) {
        return;
      }
      */

      this._protoIsMounted = true;

      // Set Window title either from props or from appRuntime
      // TODO: Remove appRuntime here; use passed props
      // const { appRuntime, title: propsTitle } = this.props;
      // const title = (appRuntime ? appRuntime.getTitle() : propsTitle);
      // this.setTitle(title);
      this.autosetTitle();

      this.autosetPosition();
      this.autosetSize();

      this.focus();

      // TODO: Fix implementation
      // (works on Chrome in Linux; not on Windows)
      await this.animate(EFFECT_CREATE);

      // this.emit(EVT_DID_MOUNT);
    } catch (exc) {
      throw exc;
    }
  }

  componentDidUpdate() {
    if (this._isClosed) {
      return;
    }

    this.autosetTitle();
  }

  componentWillUnmount() {
    this.close();
  }

  /*
  * Set init position based on last one
  */
  autosetPosition() {
    /*
    const { appRuntime } = this.props;
    const initPos = (appRuntime ? appRuntime.getInitPosition() : { x: 0, y: 0 });

    this.moveTo(initPos.x, initPos.y);
    */
   console.warn('TODO: Reimplement autoset position w/ _windowStack');
  }

  /*
   * Set init position based on last one
   */
  autosetSize() {
    const { appRuntime, minHeight, minWidth } = this.props;
    const initSize = (appRuntime ? appRuntime.getInitSize() : { width: minWidth, height: minHeight });
    this.resize(initSize.width, initSize.height)
  }

  /**
   * Sets the outer dimensions of the window to the given width and height.
   * 
   * @param {number} width 
   * @param {number} height 
   */
  resize(width, height) {
    this._resizableComponent.resize(width, height)
  }

  /**
   * Automatically sets Window title based on configuration.
   */
  autosetTitle() {
    const { title: existingTitle } = this.state;
    const { appRuntime, title: propsTitle } = this.props;
    
    const newTitle = (
      propsTitle ?
      propsTitle : appRuntime ?
      appRuntime.getTitle() : DESKTOP_UNTITLED_WINDOW_DEFAULT_TITLE
    );
    
    if (newTitle !== existingTitle) {
      this.setTitle(newTitle);
    }
  }

  /**
   * Sets the Window title.
   * 
   * @param {string} title 
   */
  setTitle(title) {
    title = (title ? title.toString() : '');

    // Ensure title is a different title
    const { title: existingTitle } = this.state;
    if (title === existingTitle) {
      return;
    }

    this.emit(EVT_BEFORE_TITLE_SET);

    this.setState({
      title
    }, () => {
      this.emit(EVT_TITLE_SET);
    });
  }

  /**
   * Retrieves the Window title.
   * 
   * @return {string}
   */
  getTitle() {
    const { title } = this.state;

    return title;
  }

  /**
   * @return {AppRuntime | undefined}
   */
  getAppRuntimeIfExists() {
    const { appRuntime } = this.props;

    return appRuntime;
  }

  /**
   * Unique identifier of the Window (not the connected AppRuntime).
   * 
   * @return {string}
   */
  getUUID() {
    return this._uuid;
  }

  /**
   * Internally called when the Window is interacted w/ via mouse or touch.
   */
  _onInteract = (evt) => {
    if (this._isClosed) {
      return;
    }

    // Focus window if touched
    this.focus();
  };

  async focus() {
    try {
      // Check if window is already focused
      if (this._isFocused && !this._isMinimized) {
        return false;
      }

      this.emit(EVT_BEFORE_FOCUS);

      this.restore();

      $(this._el).addClass(CSS_CLASS_NAME_FOCUS);

      this._isFocused = true;

      // _desktopLinkedState.setActiveWindow(this);
      // TODO: Get stack index and apply from _windowStack
      _windowStack.focusWindow(this);

      this.doCoverIfShould();

      /**
       * The zIndex is directly applied to the base DOM element, instead of
       * applied as state, because applying as state causes a re-render which
       * messes with mouse / touch functionality when selecting another Window.
       * e.g. if Window A is focused, and then the user tries to resize Window
       * B, if a re-render has to occur, the user first has to select Window B
       * before the resize will happen.
       */
      /*
      $(this._el).css({
        zIndex: _nextZIndex
      });
      ++_nextZIndex;
      */
      // TODO: Await for any effects to complete

      this.emit(EVT_FOCUS); 
    } catch (exc) {
      throw exc;
    }
  }

  async blur() {
    try {
      if (!this._isFocused) {
        return false;
      }
  
      this.emit(EVT_BEFORE_BLUR);
      
      this._isFocused = false;
  
      $(this._el).removeClass(CSS_CLASS_NAME_FOCUS);
  
      this.doCoverIfShould();

      // TODO: Await for any effects to complete
  
      this.emit(EVT_BLUR);
    } catch (exc) {
      throw exc;
    }
  }

  async toggleHide() {
    // TODO: Detect current window state and take appropriate action

    return this.hide();
  }

  // Differentiate this between minimize (or remove minimize)
  async hide() {
    try {
      this.emit(EVT_BEFORE_HIDE);

      // TODO: display: none
  
      // notify AppRuntime to pass focus
      /*
      const { onMinimize } = this.props.appRuntime;
      if (typeof onMinimize === 'function') {
        onMinimize();
      }
      */
  
      $(this._el).addClass(CSS_CLASS_NAME_HIDE);

      // TODO: Await for any effects to complete
  
      this.emit(EVT_HIDE);
    } catch (exc) {
      throw exc;
    }
  }

  async unhide() {
    try {
      this.emit(EVT_BEFORE_UNHIDE);

      // TODO: display: block
  
      // TODO: Handle accordingly
      $(this._el).removeClass(CSS_CLASS_NAME_HIDE);

      // TODO: Await for any effects to complete
  
      this.emit(EVT_UNHIDE);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Sets the z-order of the Window, visually placing it in front of, or
   * behind, other Windows, based on the highest zIndex.
   * 
   * @param {number} zIndex Higher is positioned in front of lower.
   */
  setZIndex(zIndex) {
    $(this._el).css({zIndex});
  }

  async toggleMinimize() {
    try {
      if (!this._isMinimized) {
        await this.minimize();
      } else {
        await this.restore();
      }
    } catch (exc) {
      throw exc;
    }
  }

  // TODO: Await for any effects to complete
  async minimize() {
    try {
      // Since this.resize() is not called in this method, wrap w/
      // EVT_BEFORE_RESIZE/EVT_DID_RESIZE hooks
      this.emit(EVT_BEFORE_RESIZE);

      // this.emit(EVT_BEFORE_MINIMIZE);
  
      if (!this._isMinimized) {
        await this.animate(EFFECT_MINIMIZE);
        this._isMinimized = true;
        await this.hide();
        await this.blur();
        //TODO: should focus remaining window
      }
  
      // this.emit(EVT_DID_MINIMIZE);
  
      // Since this.resize() is not called in this method, wrap w/
      // EVT_BEFORE_RESIZE/EVT_DID_RESIZE hooks
      this.emit(EVT_RESIZE);
    } catch (exc) {
      throw exc;
    }
  }

  // TODO: Await for any effects to complete
  async restore() {
    try {
      // this.emit(EVT_BEFORE_RESTORE);

      if(this._isMinimized) {
        await this.unhide();
        this._isMinimized = false;
      } else if (this._isMaximized) {
        console.warn('TODO: Apply window position / size before app was maximized');
        this._isMaximized = false;
      }

      await this.animate(EFFECT_RESTORE);

      // this.emit(EVT_DID_RESTORE); 
    } catch (exc) {
      throw exc;
    }
  }

  async toggleMaximize() {
    try {
      if (!this._isMaximized) {
        await this.maximize();
      } else {
        await this.restore();
      }
    } catch (exc) {
      throw exc;
    }
  }

  async maximize() {
    try {
      // TODO: Utilize desktopWidth / desktopHeight in DesktopLinkedState
      const { viewportSize } = _desktopLinkedState.getState();
      if (viewportSize) {
        this.emit(EVT_BEFORE_MAXIMIZE);

        const { width: viewportWidth, height: viewportHeight } = viewportSize;
    
        // TODO: Retain position prior to moving
        // TODO: Make resize properties configurable
        // TODO: Include dock location and size in resize calculations
        this.moveTo(0, 0);
        this.resize(viewportWidth - 20, viewportHeight - 60);
    
        this._isMaximized = true;
  
        // TODO: Await for any effects to complete
    
        this.emit(EVT_MAXIMIZE);
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Animates the entire window, incuding window chrome & content.
   * 
   * @param {string} effect The effect name, per
   * https://daneden.github.io/animate.css/
   * @return {Promise<void>}
   */
  async animate(effect) {
    try {
      await animate(this._el, effect);
    } catch (exc) {
      throw exc;
    }
  }

  getPosition() {
    return this._moveableComponent.getPosition();
  }

  moveTo(posX, posY) {
    this._moveableComponent.moveTo(posX, posY);
  }

  /**
   * Determines whether the Window should be overlaid with <Cover /> (a
   * transparent <div> tag), in order to prevent inadvertent interaction of
   * child DOM elements inside the Window body.
   * 
   * @return {boolean}
   */
  getShouldCover() {
    if (!this._isFocused) {
      return true;
    } else if (this._isActiveHeaderGesture || this._isResizing) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Covers the entire Window body if this.getShouldCover() determines it
   * should.  If the body should not be covered, and it is already covered,
   * it will uncover the body.
   */
  doCoverIfShould() {
    const shouldCover = this.getShouldCover();

    this._bodyCoverComponent.setIsVisible(shouldCover);
  }

  /**
   * Internally called when the Window Header has started to detect a gesture
   * (e.g. a mouse or touch event).
   * 
   * TODO: Document evt parameter type
   */
  _handleWindowHeaderGestureStart = (evt) => {
    this._isActiveHeaderGesture = true;

    this.doCoverIfShould();
  }

  /**
   * Internally called when the Window Header has stopped detecting a gesture
   * (e.g. a mouse or touch event).
   * 
   * TODO: Document evt parameter type
   */
  _handleWindowHeaderGestureEnd = (evt) => {
    this._isActiveHeaderGesture = false;

    this.doCoverIfShould();
  }

  _handleResizeStart = (evt) => {
    this._isResizing = true;

    this.doCoverIfShould();
  }

  /**
   * Called when the <DragResizable /> layer has been resized.
   */
  /*
  _handleResize = (resizeData) => {
    const { width: bodyWidth, height: bodyHeight } = this.getCalculatedBodySize();

    // this.setBodySize(bodyWidth, bodyHeight);
  };
  */

  _handleResizeEnd = (evt) => {
    this._isResizing = false;
    
    this.doCoverIfShould();
  }

  };

  /**
   * Note, the actual handling is provided in combination of <Moveable> and <DragResizable>.
   */
  _handleResizeMove = (pos, size) => {
    // this._app.onResizeMove(pos, size);
  };

  render() {
    let {
      appRuntime,
      children,
      className,
      description,
      initialWidth,
      initialHeight,
      toolbar,
      toolbarRight,
      subToolbar,
      bodyStyle,
      title: propsTitle,
      // onWindowResize,
      minWidth,
      minHeight,
      onReady,
      ...propsRest
    } = this.props;

    minWidth = minWidth || DESKTOP_WINDOW_MIN_WIDTH;
    minHeight = minHeight || DESKTOP_WINDOW_MIN_HEIGHT;

    const { title } = this.state;

    if (this._isClosed) {
      return (
        <span></span>
      );
    }

    return (
      <div
        ref={c => this._el = c}
        onMouseDown={this._onInteract}
        onTouchStart={this._onInteract}
        // TODO: Keyboard events for this?  (also, ClientGUIProcess has its own
        // "onInteract" handler)

        // Note: The width & height of the transition layer are intentionally
        // kept at 0 width / height
        className="zd-window"
      >

        <Moveable
          ref={c => this._moveableComponent = c}
          onMove={this._onResizeMove}
        // initialX={...}
        // initialY={...}
        >
          <ContextMenu>

            <DragResizable
              ref={c => this._resizableComponent = c}
              onResizeStart={this._handleResizeStart}
              // onResize={this._handleResize}
              onResizeEnd={this._handleResizeEnd}
              moveableComponent={this._moveableComponent}
              minWidth={minWidth}
              minHeight={minHeight}
              bodyClassName="zd-window-resizable"
              onBodyMount={c => this._resizableBody = c}
              onResizeMove={this._onResizeMove}
              enable={typeof this.props.sizeable == 'undefined' || this.props.sizeable == true }
            // maxWidth={}
            // maxHeight={}
            >
              <Cover>
                <StackingContext>
                  <div
                    {...propsRest}
                    ref={c => this._paintedComponent = c}
                    className="zd-window-painted"
                  >

                    {
                      // Note:  WindowHeader gesture is contained within the header
                    }

                    <WindowHeader
                      ref={c => this._windowHeaderComponent = c}
                      desktopWindow={this}
                      title={title}
                      toolbar={toolbar}
                      toolbarRight={toolbarRight}
                      subToolbar={subToolbar}
                      onGestureStart={this._handleWindowHeaderGestureStart}
                      onGestureEnd={this._handleWindowHeaderGestureEnd}
                    />

                    {
                      // TODO: Apply pixel size to window body
                    }
                    <div
                      ref={c => this.windowBodyWrapper = c}
                      className="zd-window-body-wrapper"
                    >

                      {
                        // Window background
                      }
                      <Cover className="zd-window-body-background">
                        {
                          // This is the background of the window
                        }
                      </Cover>

                      {
                        // Window foreground
                      }
                      <Cover
                        ref={c => this._windowBodyComponent = c}
                        className="zd-window-body"
                        style={bodyStyle}
                      >
                        <ErrorBoundary>
                          {
                            // The window body
                            children
                          }
                        </ErrorBoundary>
                      </Cover>

                      {
                        // Body cover
                      }
                      <Cover
                        ref={c => this._bodyCoverComponent = c}

                      // TODO: Activate to true when window is inactive,
                      // being moved, or resized.
                      // This is to prevent the window's contents from being
                      // interacted w/ when moving
                      // TODO: Consider using [ TOTAL WINDOW COVER ] below,
                      // instead(?)
                      >
                      </Cover>
                    </div>

                  </div>
                </StackingContext>
              </Cover>

              {
                /*
                <Cover>
                  [ TOTAL WINDOW COVER ]
                </Cover>
                */
              }

            </DragResizable>
          </ContextMenu>
        </Moveable>
      </div>
    );
  }

  /**
   * Closes the underlying appRuntime, if available (which will unrender the Window).
   * 
   * @return {Promise<void>}
   */
  async close() {
    try {
      if (this._isClosed || this._isClosing) {
        return;
      }

      const { appRuntime } = this.props;

      this._isClosing = true;

      this.emit(EVT_BEFORE_CLOSE);

      // Remove this window from the internal _windowStack
      /*
      _windowStack = _windowStack.filter(testWindow => {
        return !Object.is(this, testWindow);
      });
      */

      if (appRuntime) {
        await appRuntime.close();
      }
  
      this._isClosed = true;

      this.emit(EVT_CLOSE);

      // Unregister event listeners
      this._events.removeAllListeners();
      this._events = null;
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {boolean}
   */
  getIsClosed() {
    return this._isClosed;
  }
}