import Events from 'events';
import Window from './Window';

// Lifecycle events
export const EVT_WINDOW_CREATED = 'windowcreated';
export const EVT_WINDOW_MOUNTED = 'windowmounted';

export const EVT_WINDOW_TITLE_WILL_SET = 'windowtitlewillset';
export const EVT_WINDOW_TITLE_DID_SET = 'windowtitledidset';

export const EVT_WINDOW_WILL_ACTIVATE = 'windowwillactivate';
export const EVT_WINDOW_DID_ACTIVATE = 'windowdidactivate';

export const EVT_WINDOW_WILL_DEACTIVATE = 'window-will-deactivate';
export const EVT_WINDOW_DID_DEACTIVATE = 'window-did-deactivate';

// export const EVT_WINDOW_WILL_MOVE = 'window-will-move';
// export const EVT_WINDOW_DID_MOVE = 'window-did-move';

export const EVT_WINDOW_WILL_RESIZE = 'window-will-resize';
export const EVT_WINDOW_DID_RESIZE = 'window-did-resize';

export const EVT_WINDOW_WILL_MINIMIZE = 'windowwillminimize';
export const EVT_WINDOW_DID_MINIMIZE = 'windowdidminimize';

export const EVT_WINDOW_WILL_MAXIMIZE = 'windowwillmaximize';
export const EVT_WINDOW_DID_MAXIMIZE = 'windowdidmaximize';

// export const EVT_WINDOW_WILL_RESTORE = 'windowwillrestore';
// export const EVT_WINDOW_DID_RESTORE = 'windowdidrestore';

export const EVT_WINDOW_WILL_CLOSE = 'windowwillclose';
export const EVT_WINDOW_DID_CLOSE = 'windowdidclose';

export const EVT_WINDOW_WILL_HIDE = 'windowwillhide';
export const EVT_WINDOW_DID_HIDE = 'windowdidhide';

export const EVT_WINDOW_WILL_UNHIDE = 'windowwillunhide';
export const EVT_WINDOW_DID_UNHIDE = 'windowdidunhide';

// export const EVT_WINDOW_WILL_FOCUS = 'windowwillfocus';
// export const EVT_WINDOW_DID_FOCUS = 'windowdidfocus';
// export const EVT_WINDOW_WILL_BLUR = 'windowwillblur';
// export const EVT_WINDOW_DID_BLUR = 'windowdidblur'; 

let windowMasterEventInstances = [];

// TODO: Use LinkedState

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

        case EVT_WINDOW_MOUNTED:
          instance.windowMounted(window);
        break;

        case EVT_WINDOW_WILL_ACTIVATE:
          instance.windowWillActivate(window);
        break;

        case EVT_WINDOW_DID_ACTIVATE:
          instance.windowDidActivate(window);
        break;

        case EVT_WINDOW_WILL_DEACTIVATE:
          instance.windowWillDeactivate(window);
        break;

        case EVT_WINDOW_DID_DEACTIVATE:
          instance.windowDidDeactivate(window);
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

        case EVT_WINDOW_WILL_HIDE:
          instance.windowWillHide(window);
        break;

        case EVT_WINDOW_DID_HIDE:
          instance.windowDidHide(window);
        break;

        case EVT_WINDOW_WILL_UNHIDE:
          instance.windowWillUnhide(window);
        break;

        case EVT_WINDOW_DID_UNHIDE:
          instance.windowDidUnhide(window);
        break;

        case EVT_WINDOW_WILL_RESIZE:
          instance.windowWillResize(window);
        break;

        case EVT_WINDOW_DID_RESIZE:
          instance.windowDidResize(window);
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

  windowMounted(window) {
    this.emit(EVT_WINDOW_MOUNTED, window);
  }

  windowWillActivate(window) {
    this.emit(EVT_WINDOW_WILL_ACTIVATE, window);
  }

  windowDidActivate(window) {
    this.emit(EVT_WINDOW_DID_ACTIVATE, window);
  }

  windowWillDeactivate(window) {
    this.emit(EVT_WINDOW_WILL_DEACTIVATE, window);
  }

  windowDidDeactivate(window) {
    this.emit(EVT_WINDOW_DID_DEACTIVATE, window);
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

  windowWillHide(window) {
    this.emit(EVT_WINDOW_WILL_HIDE, window);
  }

  windowDidHide(window) {
    this.emit(EVT_WINDOW_DID_HIDE, window);
  }

  windowWillUnhide(window) {
    this.emit(EVT_WINDOW_WILL_UNHIDE, window);
  }

  windowDidUnhide(window) {
    this.emit(EVT_WINDOW_DID_UNHIDE, window);
  }

  windowWillResize(window) {
    this.emit(EVT_WINDOW_WILL_RESIZE, window);
  }

  windowDidResize(window) {
    this.emit(EVT_WINDOW_DID_RESIZE, window);
  }
}