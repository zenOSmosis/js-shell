import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import DesktopLinkedState from 'state/DesktopLinkedState';
import $ from 'jquery';

/**
 * Keeps track of whether the browser window is in focus on the native device
 * and updates DesktopLinkedState with its results.
 */
class ViewportFocusMonitor extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._desktopLinkedState = new DesktopLinkedState();

    this.setTitle('Viewport Focus Monitor');

    this._prevFocusBlurEventType = null;
  }

  async _init() {
    try {
      
      this._initFocusMonitoring();

      this.once(EVT_BEFORE_EXIT, () => {
        this._deinitFocusMonitoring();

        this._desktopLinkedState.destroy();
        this._desktopLinkedState = null;
      });

      // Set initial focus state
      this.setState({
        viewportIsFocused: true
      });

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  _initFocusMonitoring() {
    // TODO: Use constants for "blur" / "focus"
    $(window).on('blur focus', this._handleViewportFocusBlur);
  }

  _deinitFocusMonitoring() {
    // TODO: Use constants for "blur" / "focus"
    $(window).off('blur focus', this._handleViewportFocusBlur);
  }

  /**
   * IMPORTANT! This handles Viewport focus/blur, not Desktop Window.
   */
  _handleViewportFocusBlur = (e) => {
    if (!e) {
      console.error('e not provided. Cannot handle viewport focus/blur.');
      return;
    }

    const { type } = e;
    const prevType = this._prevFocusBlurEventType;

    if (type !== prevType) {
      let viewportIsFocused = null;

        switch (e.type) {
          // TODO: Use constant
          case 'blur':
            viewportIsFocused = false;
            break;
  
          // TODO: Use constant
          case 'focus':
            viewportIsFocused = true;
            break;
  
          default:
            // Ignore default case
            break;
        }
  
        this._prevFocusBlurEventType = type;
    
        this._desktopLinkedState.setState({
          viewportIsFocused
        });

        // TODO: Remove
        console.debug(`Viewport is ${type}ed`);
    }
  }
}

export default ViewportFocusMonitor;