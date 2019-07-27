// TODO: Enable optional debugger:  https://github.com/redsunsoft/react-render-visualizer

// Note: Window is not currently set as a HOC component due to it conflicting
// with current window actions (e.g. moving, etc)

// TODO: Enable resize / reposition of window (size / position) if screensize is changed

import React, { Component } from 'react';
// import Gesture from 'commponents/Gesture';
import ContextMenu from 'components/ContextMenu';
import ErrorBoundary from 'components/ErrorBoundary';
import Cover from 'components/Cover';
import Moveable from 'components/Moveable';
// import ViewTransition from 'components/ViewTransition';
import Resizable from 'components/Resizable';
import StackingContext from 'components/StackingContext';
import { ANIMATE_JACK_IN_THE_BOX, ANIMATE_ZOOM_OUT } from 'utils/animate';
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import WindowHeader from './Header';
import animate from 'utils/animate';
import $ from 'jquery';
import uuidv4 from 'uuid/v4';
import config from 'config';
import './style.css';
const { DESKTOP_WINDOW_MIN_WIDTH, DESKTOP_WINDOW_MIN_HEIGHT } = config;

// Note, currently is unable to share state/commonLinkedStates usage
const desktopLinkedState = new DesktopLinkedState();

const EFFECT_CREATE = ANIMATE_JACK_IN_THE_BOX;
const EFFECT_MINIMIZE = ANIMATE_ZOOM_OUT;

// TODO: Get rid of this
// let zStack = 9999;

let windowStack = [];

// TODO: Refactor elsewhere
// TODO: Implement always-on-top
export const getWindowStack = () => {
  return windowStack.filter((window) => {
    return !(window.isClosed);
  });
}

// Handle deactivation of non-active windows
// Only a single window can be "active" at a time (that is, the focused window)
(() => {
  desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
    const { activeWindow } = updatedState;

    if (typeof activeWindow !== 'undefined') {
      const windowStack = getWindowStack();

      windowStack.forEach((desktopWindow) => {
        const isActive = Object.is(activeWindow, desktopWindow);

        if (!isActive) {
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
      title: null,
      // isActive: false,
      // zStack: zStack + 1
  
      // Is automatically set to true once the window is ready to be utilized
      // via external handlers
      ready: false // TODO: Rename to isReady
    };

    this._uuid = uuidv4();
    this._isActive = false;  // TODO: Rename to isFocused

    this.isClosed = false; // TODO: Rename to _isClosed

    windowStack.push(this);
  }

  async componentDidMount() {
    try {
      if (this.isClosed) {
        return;
      }

      // Set Window title either from props or from app
      // TODO: Remove app here; use passed props
      // const { app, title: propsTitle } = this.props;
      // const title = (app ? app.getTitle() : propsTitle);
      // this.setTitle(title);
      this.autosetTitle();

      this.focus();

      await this.animate(EFFECT_CREATE);

      // this.lifecycleEvents.broadcast(EVT_WINDOW_MOUNTED);

      this.setState({
        ready: true
      }, () => {
        const { onReady } = this.props;
        if (typeof onReady === 'function') {
          onReady(this);
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  componentDidUpdate() {
    if (this.isClosed) {
      return;
    }

    this.autosetTitle();

    // TODO: Rework this
    $(this._el).css({
      zIndex: this.state.zStack
    });
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
    }, () => {
      // this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_DID_SET);
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

  getUUID() {
    return this._uuid;
  }

  _onInteract = (evt) => {
    if (this.isClosed) {
      return;
    }

    // Focus window if touched
    this.focus();
  };

  focus() {
    // Check if window is already focused
    if (this._isActive) {
      return false;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_ACTIVATE);

    // TODO: Use constant for active
    $(this._resizableBody).addClass('active'); // Affects outer draw shadow
    $(this._drawRef).addClass('active'); // Affects window assets (e.g. dot colors)

    desktopLinkedState.setActiveWindow(this);
    this._isActive = true;

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_ACTIVATE);
  }

  blur() {
    if (!this._isActive) {
      return false;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_DEACTIVATE);

    // TODO: Use constant for active
    $(this._resizableBody).removeClass('active'); // Affects outer draw shadow
    $(this._drawRef).removeClass('active'); // Affects window assets (e.g. dot colors)
    this._isActive = false;

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
   */
  async animate(effect) {
    try {
      await animate(this._el, effect);
    } catch (exc) {
      throw exc;
    }
  }

  getPosition() {
    return this._moveable.getPosition();
  }

  moveTo(posX, posY) {
    this._moveable.moveTo(posX, posY);
  }

  /**
   * Sets the outer window chrome (including resizable layer) width & height.
   * 
   * @param {number | string} width 
   * @param {number | string} height 
   */
  /*
  setOuterSize(width, height) {
    $(this._moveable).css({
      width,
      height
    });

    const $header = $(this._windowHeader);
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
  setBodySize(width, height) {
    // const { onWindowResize } = this.props;

    // this.bodyCover.setIsVisible(true);

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_RESIZE);

    $(this.windowBody).css({
      width: width,
      height: height
    });

    // this.bodyCover.setIsVisible(false);

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_RESIZE);
  }

  getCalculatedBodySize() {
    const bodyCalcStyle = window.getComputedStyle(this.windowBodyWrapper);

    const width = parseInt(bodyCalcStyle.getPropertyValue('width'));
    const height = parseInt(bodyCalcStyle.getPropertyValue('height'));

    return {
      width,
      height
    };
  }

  /**
   * Called when the <Resizable /> layer has been resized.
   */
  _handleResize = (resizeData) => {
    setTimeout(() => {
      // console.debug('window resize data', resizeData);

      // const $windowBodyWrapper = $(this.windowBodyWrapper);

      const bodyCalcSize = this.getCalculatedBodySize();
      /*
      const bodyCalcSize = {
        width: $windowBodyWrapper.width(),
        height: $windowBodyWrapper.height()
      };
      */
      this.setBodySize(bodyCalcSize.width, bodyCalcSize.height);

      // const {width, height, mainWidth, mainHeight} = resizeData;

      // this.setOuterSize(width, height);
    }, 20);

  };

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

    if (this.isClosed) {
      return (
        <span></span>
      );
    }

    return (
      <div
        ref={c => this._el = c}
        onMouseDown={this._onInteract}
        onTouchStart={this._onInteract}
        // Note: The width & height of the transition layer are intentionally
        // kept at 0 width / height
        style={{ position: 'absolute', width: 0, height: 0 }}
      >

        <Moveable
          ref={c => this._moveable = c}
        // initialX={...}
        // initialY={...}
        >
          <ContextMenu>

            <Resizable
              ref={c => this._resizable = c}
              onResize={this._handleResize}
              moveableComponent={this._moveable}
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
                    ref={c => this._drawRef = c}
                    // className={`Window ${this.state.isActive ? 'Active' : ''}`}
                    className="zd-window"
                  >

                    {
                      // Note:  WindowHeader gesture is contained within the header
                    }

                    <WindowHeader
                      ref={c => this._windowHeader = c}
                      desktopWindow={this}
                      title={title}
                      toolbar={toolbar}
                      toolbarRight={toolbarRight}
                      subToolbar={subToolbar}
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
                        ref={c => this.windowBody = c}
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
                        ref={c => this.bodyCover = c}

                        // TODO: Activate to true when window is inactive,
                        // being moved, or resized.
                        // This is to prevent the window's contents from being
                        // interacted w/ when moving
                        // TODO: Consider using [ TOTAL WINDOW COVER ] below,
                        // instead(?)
                        isVisible={false}
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

            </Resizable>
          </ContextMenu>
        </Moveable>
      </div>
    );
  }

  close() {
    const { app } = this.props;

    if (this.isClosed) {
      console.warn('Window is already closed. Skipping close.');
      return;
    }

    // this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_CLOSE);

    this.isClosed = true;

    // this.lifecycleEvents.broadcast(EVT_WINDOW_DID_CLOSE);

    console.warn('TODO: Handle window close event detach', {
      app
    });

    if (app) {
      app.close();
    }
  }
}