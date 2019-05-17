// Note: Window is not currently set as a HOC component due to it conflicting
// with current window actions (e.g. moving, etc)

// TODO: Enable resize / reposition of window (size / position) if screensize is changed

import React, { Component } from 'react';
// import Gesture from 'commponents/Gesture';
import ContextMenu from 'components/ContextMenu';
import Cover from 'components/Cover';
import Moveable from 'components/Moveable';
import ViewTransition from 'components/ViewTransition';
import Resizable from 'components/Resizable';
import StackingContext from 'components/StackingContext';
import { ANIMATE_JACK_IN_THE_BOX, ANIMATE_ZOOM_OUT } from 'utils/animate';
import /* DesktopLinkedState, */ { EVT_LINKED_STATE_UPDATE, commonDesktopLinkedState } from 'state/DesktopLinkedState';
import WindowHeader from './Header';
import $ from 'jquery';
import uuidv4 from 'uuid/v4';
import {
  WindowLifecycleEvents,
  EVT_WINDOW_CREATED,
  EVT_WINDOW_MOUNTED,
  
  EVT_WINDOW_TITLE_WILL_SET,
  EVT_WINDOW_TITLE_DID_SET,

  EVT_WINDOW_WILL_ACTIVATE,
  EVT_WINDOW_DID_ACTIVATE,
  
  EVT_WINDOW_WILL_DEACTIVATE,
  EVT_WINDOW_DID_DEACTIVATE,
  
  EVT_WINDOW_WILL_MINIMIZE,
  EVT_WINDOW_DID_MINIMIZE,
  
  EVT_WINDOW_WILL_MAXIMIZE,
  EVT_WINDOW_DID_MAXIMIZE,
  
  EVT_WINDOW_WILL_CLOSE,
  EVT_WINDOW_DID_CLOSE,
  
  EVT_WINDOW_WILL_HIDE,
  EVT_WINDOW_DID_HIDE,
  
  EVT_WINDOW_WILL_UNHIDE,
  EVT_WINDOW_DID_UNHIDE,
  
  EVT_WINDOW_WILL_RESIZE,
  EVT_WINDOW_DID_RESIZE
} from './windowLifecycleEvents';
import config from 'config';
import './style.css';
const { DESKTOP_WINDOW_MIN_WIDTH, DESKTOP_WINDOW_MIN_HEIGHT } = config;

const EFFECT_CREATE = ANIMATE_JACK_IN_THE_BOX;
const EFFECT_MINIMIZE = ANIMATE_ZOOM_OUT;

// TODO: Get rid of this
// let zStack = 9999;


let windowStack = [];

// TODO: Refactor elsewhere
export const getWindowStack = () => {
  return windowStack.filter((window) => {
    return !(window.isClosed);
  });
}

// Handle deactivation of non-active windows
// Only a single window can be "active" at a time (that is, the focused window)
(() => {
  commonDesktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
    const {activeWindow} = updatedState;

    if (typeof activeWindow !== 'undefined') {
      const windowStack = getWindowStack();

      windowStack.forEach((window) => {
        const isActive = Object.is(activeWindow, window);

        if (!isActive) {
          window.deactivate();
        }
      });
    }
  });
})();

export default class Window extends Component {
  state = {
    title: null,
    // isActive: false,
    // zStack: zStack + 1
  };

  _uuid = null;
  _isActive = false;

  constructor(props) {
    super(props);

    this._uuid = uuidv4();

    this.isClosed = false;

    windowStack.push(this);

    this.startDate = new Date();

    this.lifecycleEvents = (() => {
      const lifecycleEvents = new WindowLifecycleEvents(this);

      // Override default broadcast handler
      lifecycleEvents.broadcast = (() => {
        const oBroadcast = lifecycleEvents.broadcast;
  
        return (...args) => {
          const eventName = args[0];
          if (typeof this.props[`on${eventName}`] === 'function') {
            this.props[`on${eventName}`](this);
          }
  
          return oBroadcast.apply(this.lifecycleEvents, args);
        };
      })();

      return lifecycleEvents;
    })();

    this.lifecycleEvents.broadcast(EVT_WINDOW_CREATED);
  }

  async componentDidMount() {
    try {
      if (this.isClosed) {
        return;
      }
      
      // Set Window title either from props or from appConfig
      // TODO: Remove appConfig here; use passed props
      const { appConfig, title: propsTitle } = this.props;
      const title = (appConfig ? appConfig.getTitle() : propsTitle);
      this.setTitle(title);

      // Listen for touch / mouse
      this._startInteractListening();

      this.activate();

      await this.animate(EFFECT_CREATE);

      this.lifecycleEvents.broadcast(EVT_WINDOW_MOUNTED);
    } catch (exc) {
      throw exc;
    }
  }

  componentDidUpdate() {
    if (this.isClosed) {
      return;
    }

    // TODO: Rework this
    const base = this._base._base;

    // TODO: Rework this
    $(base).css({
      zIndex: this.state.zStack
    });
  }

  componentWillUnmount() {
    this.close();
  }

  setTitle(title) {
    if (!title) {
      console.warn('Ignoring empty title');
      return;
    }

    this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_WILL_SET);
    this.setState({
      title
    }, () => {
      this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_DID_SET);
    });
  }

  getTitle() {
    const {title} = this.state;

    return title;
  }

  getUUID() {
    return this._uuid;
  }

  _startInteractListening() {
    $(window).on('mousedown', this._onInteract);
    $(window).on('touchstart', this._onInteract);
  }


  _stopInteractListening() {
    $(window).off('mousedown', this._onInteract);
    $(window).off('touchstart', this._onInteract);
  }

  _onInteract = (evt) => {
    if (this.isClosed) {
      return;
    }

    // TODO: Rework this
    const base = this._base._base;

    // Activate window if touched
    if (base === evt.target ||
      $.contains(base, evt.target)) {
      this.activate();
    }
  };

  activate() {
    // Check if window is already activated
    if (this._isActive) {
      return false;
    }

    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_ACTIVATE);

    // TODO: Use constant for active
    $(this._resizableBody).addClass('active'); // Affects draw shadow
    $(this._drawRef).addClass('active'); // Affects window assets (e.g. dot colors)

    commonDesktopLinkedState.setActiveWindow(this);
    this._isActive = true;

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_ACTIVATE);
  }

  deactivate() {
    if (!this._isActive) {
      return false;
    }

    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_DEACTIVATE);

    // TODO: Use constant for active
    $(this._resizableBody).removeClass('active'); // Affects draw shadow
    $(this._drawRef).removeClass('active'); // Affects window assets (e.g. dot colors)
    this._isActive = false;

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_DEACTIVATE);
  }

  async toggleHide() {
    // TODO: Detect current window state and take appropriate action

    return this.hide();
  }

  async hide() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_HIDE);

    // TODO: display: none

    alert('hide');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_HIDE);
  }

  async unhide() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_UNHIDE);

    // TODO: display: block

    // TODO: Handle appropriately
    alert('unhide');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_UNHIDE);
  }

  async toggleMinimize() {
    // TODO: Detect current window state and take appropriate action

    return this.minimize();
  }

  async minimize() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MINIMIZE);

    await this.animate(EFFECT_MINIMIZE);

    await this.hide();

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MINIMIZE);
  }

  async toggleMaximize() {
    // TODO: Detect current window state and take appropriate action

    return this.maximize();
  }

  async maximize() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MAXIMIZE);

    // TODO: Handle appropriately
    alert('maximize');

    // Lock:
    // Upper panel buffer = 1
    // Dock buffer = 1
    // Height = Background height - (Dock height + Dock buffer) - Upper panel height ( + Upper panel buffer)
    // Top = Upper panel height + (Upper panel buffer)

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MAXIMIZE);
  }

  /**
   * Animates the entire window, incuding window chrome & content.
   * 
   * @param {string} effect The effect name, per
   * https://daneden.github.io/animate.css/
   */
  async animate(effect) {
    try {
      // TODO: Rework base parsing
      const base = this._base;

      await base.animate(effect); 
    } catch (exc) {
      throw exc;
    }
  }

  getPosition() {
    return this.moveable.getPosition();
  }

  moveTo(posX, posY) {
    this.moveable.moveTo(posX, posY);
  }

  /**
   * Sets the outer window chrome (including resizable layer) width & height.
   * 
   * @param {number} width 
   * @param {number} height 
   */
  setOuterSize(width, height) {
    $(this.moveable).css({
      width,
      height
    });

    const $header = $(this.windowHeader);
    const headerHeight = $header.outerHeight();

    const bodyHeight = height - headerHeight;

    console.debug({
      headerHeight,
      bodyHeight,
      height
    });

    // this.setBodySize('100%', bodyHeight);
  }

  /**
   * Sets the inner window body content width & height.
   * 
   * @param {number} width 
   * @param {number} height 
   */
  setBodySize(width, height) {
    this._callResize(() => {
      $(this.windowBody).css({
        width: width,
        height: height
      });
    });
  }

  _callResize(resizeHandler) {
    const { onWindowResize } = this.props;

    // this.bodyCover.setIsVisible(true);

    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_RESIZE);

    resizeHandler();

    if (typeof onWindowResize === 'function') {
      onWindowResize({
        bodySize: this.getCalculatedBodySize()
      });
    }

    // this.bodyCover.setIsVisible(false);

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_RESIZE);
  }

  /*
  getCalculatedWindowSize() {

  }
  */

  getCalculatedBodySize() {
    const bodyCalcStyle = window.getComputedStyle(this.windowBodyWrapper);

    const width = parseInt(bodyCalcStyle.getPropertyValue('width'));
    const height = parseInt(bodyCalcStyle.getPropertyValue('height'));

    return {
      width,
      height
    }
  }

  /**
   * Called when the <Resizable /> layer has been resized.
   */
  _handleTouchResize = (resizeData) => {
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
      appConfig,
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
      onWindowResize,
      minWidth,
      minHeight,
      ...propsRest
    } = this.props;

    minWidth = minWidth || DESKTOP_WINDOW_MIN_WIDTH;
    minHeight = minHeight || DESKTOP_WINDOW_MIN_HEIGHT;

    const { title } = this.state;

    // TODO: Remove hardcoded position
    /*
    const pos = {
      x: 50,
      y: 50
    };
    */

    // Width & height of 0 on backing div is important for allowing windows to
    // move if two, or more windows, are created on the same coordinates

    if (this.isClosed) {
      return (
        <span></span>
      );
    }

    return (
      <ViewTransition
        ref={c => this._base = c}
        className={`${className ? className : ''}`}
        // Important to note that the width & height of the transition layer
        // is intentionally kept at 0 width / height
        style={{ position: 'absolute', width: 0, height: 0 }}
        effect={null}
      >
        {
          /*
          <Draggable
            scale={1}
          >
          */
        }

        <Moveable
          ref={c => this.moveable = c}
        // initialX={...}
        // initialY={...}
        >
        <ContextMenu>

          <Resizable
            ref={c => this._resizable = c}
            onResize={this._handleTouchResize}
            moveableComponent={this.moveable}
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
                      ref={c => this.windowHeader = c}
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
                      <Cover
                        ref={c => this.windowBody = c}
                        className="zd-window-body"
                        style={bodyStyle}
                      >
                        {
                          children
                        }
                      </Cover>

                      {
                        // Body cover
                      }
                      <Cover
                        ref={c => this.bodyCover = c}

                        // TODO: Activate to true when window is inactive, being moved, or resized.
                        isVisible={false}
                      >
                        {
                          // TODO: Remove this
                        }
                      </Cover>
                    </div>

                    <div>
                      {
                        /*
                        [bottom]
                        */
                      }
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

        {
          /*
          </Draggable>
          */
        }

      </ViewTransition>
    );
  }

  close() {
    if (this.isClosed) {
      console.warn('Window is already closed. Skipping close.');
      return;
    }

    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_CLOSE);

    if (this._stopInteractListening) {
      this._stopInteractListening();
    }

    // TODO: Rework base parsing
    // TODO: Remove element from DOM, completely
    const base = this._base._base;
    base.style.display = 'none';

    this.isClosed = true;

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_CLOSE);

    console.warn('TODO: Handle window close and detach event');
  }
}