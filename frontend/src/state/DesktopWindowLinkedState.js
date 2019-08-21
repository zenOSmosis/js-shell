import LinkedState from './LinkedState';

const DESKTOP_WINDOW_LINKED_SCOPE_NAME = `desktopWindowLinkedState`;

/**
 * @extends LinkedState
 */
class DesktopWindowLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_WINDOW_LINKED_SCOPE_NAME, {
      desktopWindows: []
    });
  }

  /**
   * Internally called by core/ShellDesktop/WindowStackCentral.
   * 
   * @param {Desktop.Window} desktopWindow 
   */
  addWindow(desktopWindow) {
    const { desktopWindows } = this.getState();

    desktopWindows.push(desktopWindow);

    this.setState({
      desktopWindows
    });
  }

  /**
   * Internally called by core/ShellDesktop/WindowStackCentral.
   * 
   * @param {Desktop.Window} desktopWindow 
   */
  removeWindow(desktopWindow) {
    let { desktopWindows } = this.getState();

    desktopWindows = desktopWindows.filter(testDesktopWindow => {
      return !Object.is(testDesktopWindow, desktopWindow);
    });

    this.setState({
      desktopWindows
    });
  }
}

export default DesktopWindowLinkedState;