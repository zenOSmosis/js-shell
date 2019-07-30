// TODO: Enable optional debugger:  https://github.com/redsunsoft/react-render-visualizer

// Note: Window is not currently set as a HOC component due to it conflicting
// with current window actions (e.g. moving, etc)

// TODO: Enable resize / reposition of window (size / position) if screensize is changed

import React, { Component } from 'react';
import WindowHeader from './Header';
// import Gesture from 'commponents/Gesture';
import ContextMenu from 'components/ContextMenu';
import Cover from 'components/Cover';
import DragResizable from 'components/DragResizable';
import ErrorBoundary from 'components/ErrorBoundary';
import Moveable from 'components/Moveable';
import StackingContext from 'components/StackingContext';
// import ViewTransition from 'components/ViewTransition'
import './style.css';
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import { ANIMATE_JACK_IN_THE_BOX, ANIMATE_ZOOM_OUT } from 'utils/animate';
import animate from 'utils/animate';
import config from 'config';
import $ from 'jquery';
import uuidv4 from 'uuid/v4';
const { DESKTOP_WINDOW_MIN_WIDTH, DESKTOP_WINDOW_MIN_HEIGHT } = config;

const EFFECT_CREATE = ANIMATE_JACK_IN_THE_BOX;
const EFFECT_MINIMIZE = ANIMATE_ZOOM_OUT;

const CSS_CLASS_NAME_FOCUS = 'focus';

// The CSS z-index level the next focused Window will have
// This value is automatically incremented internally
let _nextZIndex = 0;

// An array of windows
let _windowStack = [];

/**
 * TODO: Refactor elsewhere
 * TODO: Implement always-on-top
 * 
 * @return {Window[]} An array of Window instances
 */
export const getWindowStack = () => {
  return _windowStack.filter((window) => {
    return !window.getIsClosed();
  });
}

const commonDesktopLinkedState = new DesktopLinkedState();

// Handle blurring of non-focused windows
// Only a single window can be "active" at a time (that is, the focused window)
(() => {
  commonDesktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
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

export default class Window extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null
    };

    this._uuid = uuidv4();

    // Base DOM element for the Window
    this._el = null;

    this._moveableComponent = null;
    this._resizableComponent = null;
    this._paintedComponent = null;
    this._windowHeaderComponent = null;
    this._windowBodyComponent = null;
    this._bodyCoverComponent = null;

    this._isFocused = false;
    this._isActiveHeaderGesture = false;
    this._isResizing = false;

    this._isClosed = false;

    // Add this window to the stack
    _windowStack.push(this);
  }

  async componentDidMount() {
    try {
      /*
      if (this._isClosed) {
        return;
      }
      */

      this._protoIsMounted = true;

      // Set Window title either from props or from app
      // TODO: Remove app here; use passed props
      // const { app, title: propsTitle } = this.props;
      // const title = (app ? app.getTitle() : propsTitle);
      // this.setTitle(title);
      this.autosetTitle();

      this.focus();

      await this.animate(EFFECT_CREATE);

      // this.lifecycleEvents.broadcast(EVT_WINDOW_MOUNTED);
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

  /**
   * Automatically sets Window title based on configuration.
   */
  autosetTitle() {
    const { title: existingTitle } = this.state;
    const { app, title: propsTitle } = this.props;
    const newTitle = (app ? app.getTitle() : propsTitle);
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
    if (!title) {
      console.warn('Ignoring empty title');
      return;
    }

    const { title: existingTitle } = this.state;
    if (title === existingTitle) {
      console.warn('Title has not changed');
      return;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_WILL_SET);
    this.setState({
      title
    }/*, () => {
      // this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_DID_SET);
    }*/);
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

  getIsClosed() {
    return this._isClosed;
  }

  getUUID() {
    return this._uuid;
  }

  _onInteract = (evt) => {
    if (this._isClosed) {
      return;
    }

    // Focus window if touched
    this.focus();
  };

  focus() {
    // Check if window is already focused
    if (this._isFocused) {
      return false;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_ACTIVATE);

    this._isFocused = true;

    commonDesktopLinkedState.setActiveWindow(this);
    
    $(this._el).addClass(CSS_CLASS_NAME_FOCUS);

    this.doCoverIfShould();

    /**
     * The zIndex is directly applied to the base DOM element, instead of
     * applied as state, because applying as state causes a re-render which
     * messes with mouse / touch functionality when selecting another Window.
     * e.g. if Window A is focused, and then the user tries to resize Window
     * B, if a re-render has to occur, the user first has to select Window B
     * before the resize will happen.
     */
    $(this._el).css({
      zIndex: _nextZIndex
    });
    ++_nextZIndex;
    
    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_ACTIVATE);
  }

  blur() {
    if (!this._isFocused) {
      return false;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_DEACTIVATE);
    this._isFocused = false;

    $(this._el).removeClass(CSS_CLASS_NAME_FOCUS);

    this.doCoverIfShould();

    //  this.lifecycleEvents.broadcast(EVT_WINDOW_DID_DEACTIVATE);
  }

  async toggleHide() {
    // TODO: Detect current window state and take appropriate action

    return this.hide();
  }

  async hide() {
    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_HIDE);

    // TODO: display: none

    alert('hide');

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_HIDE);
  }

  async unhide() {
    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_UNHIDE);

    // TODO: display: block

    // TODO: Handle accordingly
    alert('unhide');

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_UNHIDE);
  }

  async toggleMinimize() {
    // TODO: Detect current window state and take appropriate action

    return this.minimize();
  }

  async minimize() {
    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MINIMIZE);

    await this.animate(EFFECT_MINIMIZE);

    await this.hide();

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MINIMIZE);
  }

  async toggleMaximize() {
    // TODO: Detect current window state and take appropriate action

    return this.maximize();
  }

  async maximize() {
    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MAXIMIZE);

    // TODO: Handle accordingly
    alert('maximize');

    // Lock:
    // Upper panel buffer = 1
    // Dock buffer = 1
    // Height = Background height - (Dock height + Dock buffer) - Upper panel height ( + Upper panel buffer)
    // Top = Upper panel height + (Upper panel buffer)

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MAXIMIZE);
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
   * Sets the outer window chrome (including resizable layer) width & height.
   * 
   * @param {number | string} width 
   * @param {number | string} height 
   */
  /*
  setOuterSize(width, height) {
    $(this._moveableComponent).css({
      width,
      height
    });

    const $header = $(this._windowHeaderComponent);
    const headerHeight = $header.outerHeight();

    const bodyHeight = height - headerHeight;

    console.debug({
      headerHeight,
      bodyHeight,
      height
    });

    // this.setBodySize('100%', bodyHeight);
  }
  */

  /**
   * Sets the inner window body content width & height.
   * 
   * @param {number | string} width 
   * @param {number | string} height 
   */
  /*
  setBodySize(width, height) {
    window.requestAnimationFrame(() => {
      $(this._windowBodyComponent).css({
        width: width,
        height: height
      });
    });
  }
  */

  /*
  getCalculatedBodySize() {
    const bodyCalcStyle = window.getComputedStyle(this.windowBodyWrapper);

    const width = parseInt(bodyCalcStyle.getPropertyValue('width'));
    const height = parseInt(bodyCalcStyle.getPropertyValue('height'));

    return {
      width,
      height
    };
  }
  */

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

  render() {
    let {
      app,
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
   * Closes the underlying app, if available (which will unrender the Window).
   * 
   * @return {Promise<void>}
   */
  async close() {
    try {
      if (this._isClosed) {
        console.warn('Window is already closed. Skipping close.');
        return;
      }

      const { app } = this.props;

      // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_CLOSE);

      // Remove this window from the internal _windowStack
      _windowStack = _windowStack.filter(testWindow => {
        return !Object.is(this, testWindow);
      });
  
      // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_CLOSE);
  
      if (app) {
        await app.close();
      }
  
      this._isClosed = true;
    } catch (exc) {
      throw exc;
    }
  }
}