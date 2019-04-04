import Events from 'events';
import React, {Component} from 'react';
import Draggable from 'react-draggable';
import ViewTransition from '../../ViewTransition';
import $ from 'jquery';
import './style.css';

// TODO: Enable auto-recomposition of window (contents / position) if screensize is changed

// Lifecycle events
export const EVT_WINDOW_CREATED = 'windowcreated';
export const EVT_WINDOW_TITLE_WILL_SET = 'windowtitlewillset';
export const EVT_WINDOW_TITLE_DID_SET = 'windowtitledidset';
export const EVT_WINDOW_WILL_ACTIVATE = 'windowwillactivate';
export const EVT_WINDOW_DID_ACTIVATE = 'windowdidactivate';
// export const EVT_WINDOW_WILL_DEACTIVATE = 'window-will-deactivate';
// export const EVT_WINDOW_DID_DEACTIVATE = 'window-did-deactivate';
// export const EVT_WINDOW_WILL_MOVE = 'window-will-move';
// export const EVT_WINDOW_DID_MOVE = 'window-did-move';
// export const EVT_WINDOW_WILL_RESIZE = 'window-will-resize';
// export const EVT_WINDOW_DID_RESIZE = 'window-did-resize';
export const EVT_WINDOW_WILL_MINIMIZE = 'windowwillminimize';
export const EVT_WINDOW_DID_MINIMIZE = 'windowdidminimize';
export const EVT_WINDOW_WILL_MAXIMIZE = 'windowwillmaximize';
export const EVT_WINDOW_DID_MAXIMIZE = 'windowdidmaximize';
export const EVT_WINDOW_WILL_CLOSE = 'windowwillclose';
export const EVT_WINDOW_DID_CLOSE = 'windowdidclose';
export const EVT_WINDOW_WILL_HIDE = 'windowwillhide';
export const EVT_WINDOW_DID_HIDE = 'windowdidhide';

let zStack = 9999;

let windowStack = [];

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
    return this._startDate;
  }

  _onDesktopInteract = (evt) => {
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

    const base = this._base._base;

    console.debug(this.state.zStack);

    $(base).css({
      zIndex: this.state.zStack
    });
  }

  componentDidMount() {
    if (this.isClosed) {
      return;
    }

    $(window).on('mousedown', this._onDesktopInteract);
    $(window).on('touchstart', this._onDesktopInteract);

    this.setTitle(this.props.title);

    this.activate();
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

    $(window).off('mousedown', this._onDesktopInteract);
    $(window).off('touchstart', this._onDesktopInteract);

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

  hide() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_HIDE);

    alert('hide');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_HIDE);
  }

  toggleMinimize() {
    // TODO: Detect current window state and take appropriate action

    this.minimize();
  }

  minimize() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MINIMIZE);

    alert('minimize');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MINIMIZE);
  }

  toggleMaximize() {
    // TODO: Detect current window state and take appropriate action

    this.maximize();
  }

  maximize() {
    this.lifecycleEvents.broadcast(EVT_WINDOW_WILL_MAXIMIZE);

    alert('maximize');

    this.lifecycleEvents.broadcast(EVT_WINDOW_DID_MAXIMIZE);
  }

  render() {
    const {children, className, ...propsRest} = this.props;
    const title = this.state.title;

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
        style={{position: 'absolute', width: 0, height: 0}}
        effect={null}
      >
        <Draggable
          scale={1}
        >
          <div
            {...propsRest}
            className={`Window ${this.state.isActive ? 'Active' : ''}`}
          >
            <div className="WindowHeader">
              <div style={{width: '100%', position: 'absolute', fontWeight: 'bold'}}>
                {
                  title
                }
              </div>
              <div style={{position: 'absolute', left: 0}} className="column left">
                <button 
                    className="Dot Red"
                    onClick={ (evt) => this.close() }
                ></button>
                <button
                    className="Dot Yellow"
                    onClick={ (evt) => this.toggleMinimize() }
                ></button>
                <button className="Dot Green"></button>
              </div>
            </div>

            {
              // TODO: Apply pixel size to window body
            }
            <div className="WindowBody">
                {
                  children
                }
            </div>
            <div>
              [bottom]
            </div>
          </div>
        </Draggable>
      </ViewTransition>
    );
  }
}

let windowMasterEventInstances = [];

export class WindowLifecycleEvents extends Events {
  constructor(window = null) {
    super();

    if (window && !(window instanceof Window)) {
      throw new Error('window argument must be an instance of Window');
    }
    this.window = window;

    windowMasterEventInstances.push(this);
  }

  /**
   * Broadcasts event and window to all instantiated class objects.
   * 
   * @param {string} eventName 
   * @param {Window} window Instantiated React window
   */
  broadcast(eventName, window = null) {
    if (this.window && window) {
      throw new Error('Class is already locked to a window.  Do not pass window argument in broadcast.');
    } else if (window === null) {
      window = this.window;
    }

    windowMasterEventInstances.forEach(instance => {
      switch (eventName) {
        case EVT_WINDOW_CREATED:
          instance.windowCreated(window);
        break;

        case EVT_WINDOW_WILL_ACTIVATE:
          instance.windowWillActivate(window);
        break;

        case EVT_WINDOW_DID_ACTIVATE:
          instance.windowDidActivate(window);
        break;

        case EVT_WINDOW_WILL_MINIMIZE:
          instance.windowWillMinimize(window);
        break;

        case EVT_WINDOW_DID_MINIMIZE:
          instance.windowDidMinimize(window);
        break;

        case EVT_WINDOW_WILL_MAXIMIZE:
          instance.windowWillMaximize(window);
        break;

        case EVT_WINDOW_DID_MAXIMIZE:
          instance.windowDidMaximize(window);
        break;

        case EVT_WINDOW_WILL_CLOSE:
          instance.windowWillClose(window);
        break;

        case EVT_WINDOW_DID_CLOSE:
          instance.windowDidClose(window);
        break;

        case EVT_WINDOW_TITLE_WILL_SET:
          instance.windowTitleWillSet(window);
        break;

        case EVT_WINDOW_TITLE_DID_SET:
          instance.windowTitleDidSet(window);
        break;

        default:
          throw new Error(`Unhandled broadcast event with name ${eventName}`);
      }
    });
  }

  emit(eventName, window) {
    if (!(window instanceof Window)) {
      throw new Error('Window is not of proper type');
    }

    return super.emit.apply(this, [eventName, window]);
  }

  // Binding can be done by either overriding this method, or attaching to the
  // event cycle
  windowCreated(window) {
    this.emit(EVT_WINDOW_CREATED, window);
  }

  windowWillActivate(window) {
    this.emit(EVT_WINDOW_WILL_ACTIVATE, window);
  }

  windowDidActivate(window) {
    this.emit(EVT_WINDOW_DID_ACTIVATE, window);
  }

  windowWillMinimize(window) {
    this.emit(EVT_WINDOW_WILL_MINIMIZE, window);
  }

  windowDidMinimize(window) {
    this.emit(EVT_WINDOW_DID_MINIMIZE, window);
  }

  windowWillMaximize(window) {
    this.emit(EVT_WINDOW_WILL_MAXIMIZE, window);
  }

  windowDidMaximize(window) {
    this.emit(EVT_WINDOW_DID_MAXIMIZE, window);
  }

  windowWillClose(window) {
    this.emit(EVT_WINDOW_WILL_CLOSE, window);
  }

  windowDidClose(window) {
    this.emit(EVT_WINDOW_DID_CLOSE, window);
  }

  windowTitleWillSet(window) {
    this.emit(EVT_WINDOW_TITLE_WILL_SET, window);
  }

  windowTitleDidSet(window) {
    this.emit(EVT_WINDOW_TITLE_DID_SET, window);
  }
}

export const getWindowStack = () => {
  return windowStack.filter((window) => {
    return !(window.isClosed);
  });
}