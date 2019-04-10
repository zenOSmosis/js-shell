import React, { Component } from 'react';
import Cover from '../../Cover';
import BodyCoverContent from './BodyCoverContent';
import Moveable from '../../Moveable';
import ViewTransition from '../../ViewTransition';
import WindowHeader from './WindowHeader';
import $ from 'jquery';
import './style.css';
import {
  WindowLifecycleEvents,
  EVT_WINDOW_CREATED,
  EVT_WINDOW_MOUNTED,
  EVT_WINDOW_TITLE_WILL_SET,
  EVT_WINDOW_TITLE_DID_SET,
  EVT_WINDOW_WILL_ACTIVATE,
  EVT_WINDOW_DID_ACTIVATE,
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
} from './windowEvents';
import Resizable from '../../Resizable';

// import * as MacOS from 'react-desktop/macOs';

// TODO: Enable auto-recomposition of window (contents / position) if screensize is changed

const EFFECT_CREATE = 'fadeIn';
const EFFECT_MINIMIZE = 'zoomOut';

let zStack = 9999;

let windowStack = [];

export const getWindowStack = () => {
  return windowStack.filter((window) => {
    return !(window.isClosed);
  });
}

export default class Window extends Component {
  state = {
    title: null,
    isActive: false,
    zStack: zStack + 1
  };

  constructor(props) {
    super(props);

    this.isClosed = false;

    windowStack.push(this);

    this.lifecycleEvents = new WindowLifecycleEvents(this);

    this.startDate = new Date();

    this.lifecycleEvents.broadcast = (() => {
      const oBroadcast = this.lifecycleEvents.broadcast;

      return (...args) => {
        const eventName = args[0];
        if (typeof this.props[`on${eventName}`] === 'function') {
          this.props[`on${eventName}`](this);
        }

        return oBroadcast.apply(this.lifecycleEvents, args);
      };
    })();

    this.lifecycleEvents.broadcast(EVT_WINDOW_CREATED);
  }

  getUptime() {
    // TODO: Return time difference from start date
    return this.startDate;
  }

  /*
  _startInteractListening() {
    $(window).on('mousedown', this._onInteract);
    $(window).on('touchstart', this._onInteract);
  }
  */

  /*
  _stopInteractListening() {
    $(window).off('mousedown', this._onInteract);
    $(window).off('touchstart', this._onInteract);
  }
  */

  /*
  _onInteract = (evt) => {
    if (this.isClosed) {
      return;
    }

    const base = this._base._base;

    if (base === evt.target ||
      $.contains(base, evt.target)) {
      this.activate();
    } else {
      this.deactivate();
    }
  };
  */

  activate() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_ACTIVATE);

    this.setState({
      isActive: true,
      zStack: this.state.zStack + 1
    }, () => {
      this.lifecycleEvents.broadcast(EVT_WINDOW_DID_ACTIVATE);
    });
  }

  deactivate() {
    if (this.state.isActive) {
      this.setState({
        isActive: false
      });
    }
  }

  componentDidUpdate() {
    if (this.isClosed) {
      return;
    }

    // TODO: Rework this
    const base = this._base._base;

    console.debug(this.state.zStack);

    $(base).css({
      zIndex: this.state.zStack
    });
  }

  async componentDidMount() {
    if (this.isClosed) {
      return;
    }

    // this._startInteractListening();

    this.setTitle(this.props.title);

    this.activate();

    await this.animate(EFFECT_CREATE);

    this.lifecycleEvents.broadcast(EVT_WINDOW_MOUNTED);
  }

  componentWillUnmount() {
    this.close();
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
    const base = this._base._base;
    base.style.display = 'none';

    this.isClosed = true;

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_CLOSE);
  }

  // TODO: Convert into 'metaProperty'
  // metaProperty will set / did set
  setTitle(title) {
    this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_WILL_SET);
    this.setState({
      title
    }, () => {
      this.lifecycleEvents.broadcast(EVT_WINDOW_TITLE_DID_SET);
    });
  }

  toggleHide() {
    // TODO: Detect current window state and take appropriate action

    this.hide();
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

    alert('maximize');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MAXIMIZE);
  }

  /**
   * Animates the entire window, incuding window chrome & content.
   * 
   * @param {string} effect The effect name, within
   * https://daneden.github.io/animate.css/
   */
  async animate(effect) {
    // TODO: Rework base parsing
    const base = this._base;

    await base.animate(effect);
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
      $(this.subBody).css({
        width: width,
        height: height
      });
    });
  }

  /*
  getCalculatedWindowSize() {

  }
  */

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

  getCalculatedBodySize() {
    const bodyCalcStyle = window.getComputedStyle(this.windowBody);

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
      console.debug('window resize data', resizeData);

      const $windowBody = $(this.windowBody);

      const bodyCalcSize = this.getCalculatedBodySize();
      /*
      const bodyCalcSize = {
        width: $windowBody.width(),
        height: $windowBody.height()
      };
      */
      this.setBodySize(bodyCalcSize.width, bodyCalcSize.height);

      // const {width, height, mainWidth, mainHeight} = resizeData;

      // this.setOuterSize(width, height);
    }, 20);

  };

  render() {
    let { children, className, description, initialWidth, initialHeight, toolbar, toolbarRight, subToolbar, bodyStyle, title: propsTitle, onWindowResize, ...propsRest } = this.props;
    const title = this.state.title || propsTitle;
    toolbar = toolbar || title;

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
        // posX={pos.x}
        // posY={pos.y}
        >

          <Resizable
            onResize={this._handleTouchResize}
            moveableComponent={this.moveable}
            // minWidth={}
            // minHeight={}
            // maxWidth={}
            // maxHeight={}
          >
            <Cover>

              <div
                {...propsRest}
                className={`Window ${this.state.isActive ? 'Active' : ''}`}
              >
                <WindowHeader
                  ref={ c => this.windowHeader = c }
                  desktopWindow={this}
                  toolbar={toolbar}
                  toolbarRight={toolbarRight}
                  subToolbar={subToolbar}
                />

                {
                  /*
                  <MacOS.TitleBar
                    // title={title}
                    controls
                    inset
                    style={{padding: '0px', height: '24px'}} 
                  >
                    <MacOS.Toolbar style={{width: '100%', position: 'absolute', fontWeight: 'bold'}}>
                      {
                        toolbar
                      }
                    </MacOS.Toolbar>
                  </MacOS.TitleBar>
                  */
                }

                {
                  // TODO: Apply pixel size to window body
                }
                <div
                  ref={c => this.windowBody = c}
                  className="WindowBody"
                >
                  <Cover
                    ref={c => this.subBody = c}
                    style={bodyStyle}
                  >
                    {
                      children
                    }
                  </Cover>

                  <Cover
                    ref={c => this.bodyCover = c}
                    defaultIsVisible={false}
                  >
                    <BodyCoverContent />
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
            </Cover>

            {
              /*
              <Cover>
                [ TOTAL WINDOW COVER ]
              </Cover>
              */
            }

          </Resizable>
        </Moveable>

        {
          /*
          </Draggable>
          */
        }

      </ViewTransition>
    );
  }
}