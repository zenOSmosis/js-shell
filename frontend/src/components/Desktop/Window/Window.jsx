import React, {Component} from 'react';
import Draggable from 'react-draggable';
import ViewTransition from '../../ViewTransition';
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
  EVT_WINDOW_DID_UNHIDE
} from './windowEvents';
import WindowResizableLayer from './WindowResizableLayer';

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

    this._startDate = new Date();

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
    return this._startDate;
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

    const base = this._base._base;

    if (base === evt.target ||
        $.contains(base, evt.target)) {
      this.activate();
    } else {
      this.deactivate(); 
    }
  };

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

    this._startInteractListening();

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

    this._stopInteractListening();

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

  render() {
    let {children, className, initialWidth, initialHeight, toolbar, toolbarRight, subToolbar, bodyStyle, title: propsTitle, ...propsRest} = this.props;
    const title = this.state.title || propsTitle;
    toolbar = toolbar || title;

    bodyStyle = Object.assign({}, bodyStyle, {
      // TODO: Refactor hardcoded styling
      width: '100%',
      height: 400
    });

    // Width & height of 0 on backing div is important for allowing windows to
    // move if two, or more windows, are created on the same coordinates

    if (this.isClosed) {
      return (
        <span></span>
      );
    }

    return (
      <ViewTransition
        ref={ c => this._base = c }
        className={`${className ? className : ''}`}
        // Important to note that the width & height of the transition layer
        // is intentionally kept at 0 width / height
        style={{position: 'absolute', width: 0, height: 0}}
        effect={null}
      >
        <Draggable
          scale={1}
        >
        
        <WindowResizableLayer>
        <div
          {...propsRest}
          className={`Window ${this.state.isActive ? 'Active' : ''}`}
        >
            <div className="WindowHeader">
              <div>
                {
                  // TODO: Move styles to CSS declaration
                }
                <div style={{width: '100%', textAlign: 'center', fontWeight: 'bold'}}>
                  {
                    toolbar
                  }
                </div>
                <div style={{position: 'absolute', left: 0, top: 0}} className="column left">
                  <button 
                    className="Dot Red"
                    onClick={ (evt) => this.close() }
                  ></button>
                  <button
                    className="Dot Yellow"
                    onClick={ (evt) => this.toggleMinimize() }
                  ></button>
                  <button
                    className="Dot Green"
                    onClick={ (evt) => this.toggleMaximize() }
                  ></button>
                </div>
                <div style={{position: 'absolute', right: 0, top: 0}} className="column right">
                  {
                    toolbarRight
                  }
                </div>
              </div>

              <div>
                {
                  subToolbar
                }
              </div>
            </div>

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
            <div className="WindowBody"
              style={bodyStyle}
              // onMouseDown={(evt) => evt.stopPropagation()}
            >
              {
                children
              }
            </div>
            
            <div>
              {
                /*
                [bottom]
                */
              }
            </div>

          </div>
          </WindowResizableLayer>
        </Draggable>
      </ViewTransition>
    );
  }
}