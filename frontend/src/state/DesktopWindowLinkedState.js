import LinkedState from './LinkedState';

const DESKTOP_WINDOW_LINKED_SCOPE_NAME = `desktopWindowLinkedState`;

export const STATE_DESKTOP_WINDOWS = 'desktopWindows';

/**
 * @extends LinkedState
 */
class DesktopWindowLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_WINDOW_LINKED_SCOPE_NAME, {
      [STATE_DESKTOP_WINDOWS]: []
    });
  }

  /**
   * Internally called by core/ShellDesktop/WindowStackCentral.
   * 
   * @param {Desktop.Window} desktopWindow 
   */
  addWindow(desktopWindow) {
    const { [STATE_DESKTOP_WINDOWS]: desktopWindows } = this.getState();

    desktopWindows.push(desktopWindow);

    this.setState({
      [STATE_DESKTOP_WINDOWS]: desktopWindows
    });
  }

  /**
   * Internally called by core/ShellDesktop/WindowStackCentral.
   * 
   * @param {Desktop.Window} desktopWindow 
   */
  removeWindow(desktopWindow) {
    let { [STATE_DESKTOP_WINDOWS]: desktopWindows } = this.getState();

    desktopWindows = desktopWindows.filter(testDesktopWindow => {
      return !Object.is(testDesktopWindow, desktopWindow);
    });

    this.setState({
      [STATE_DESKTOP_WINDOWS]: desktopWindows
    });
  }
}

export default DesktopWindowLinkedState;