import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import DesktopLinkedState from 'state/DesktopLinkedState';

/**
 * Keeps track of the browser window size on the native device and updates
 * DesktopLinkedState.
 */
class ViewportSizeMonitor extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._desktopLinkedState = new DesktopLinkedState();

    this.setTitle('Viewport Size Monitor');

    this._prevFocusBlurEventType = null;
  }

  async _init() {
    try {
      
      this._initSizeMonitoring();

      this.once(EVT_BEFORE_EXIT, () => {
        this._deinitSizeMonitoring();

        this._desktopLinkedState.destroy();
        this._desktopLinkedState = null;
      });

      // Set initial state
      this._handleViewportSizeUpdate();

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  _initSizeMonitoring() {
    // TODO: Use constant for resize
    window.addEventListener('resize', this._handleViewportSizeUpdate);
  }

  _deinitSizeMonitoring() {
    // TODO: Use constant for resize
    window.removeEventListener('resize', this._handleViewportSizeUpdate);
  }

  /**
   * IMPORTANT! This handles Viewport focus/blur, not Desktop Window.
   */
  _handleViewportSizeUpdate = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this._desktopLinkedState.setState({
      viewportSize: {
        width,
        height
      }
    });
  }
}

export default ViewportSizeMonitor;