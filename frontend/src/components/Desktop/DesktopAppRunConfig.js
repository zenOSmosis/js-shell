import EventEmitter from 'events';
import LinkedState, {EVT_BROADCAST_STATE_UPDATE} from '../../state/LinkedState';
// import Window from './Window';

export {
  EVT_BROADCAST_STATE_UPDATE
};

// TODO: Determine fan-in/fan-out

export class DesktopAppRunConfigLinkedState extends LinkedState {
  constructor() {
    super('desktop-app-run-configs', {
      runConfigs: []
    });
  }

  addRunConfig(runConfig) {
    if (!(runConfig instanceof DesktopAppRunConfig)) {
      throw new Error('runConfig must be instance of DesktopAppRunConfig');
    }

    const {runConfigs} = this.getState();

    runConfigs.push(runConfig);

    this.setState({
      runConfigs
    });
  }

  getRunConfigs() {
    const {runConfigs} = this.getState();

    return runConfigs;
  }
}

/**
 * DesktopAppRunConfig controls components, such as the Dock, and places menus
 * in them.
 * 
 * In order to create a new Dock item, simply create a new process with
 * an icon.
 * 
 * TODO: Revise this documentation as needed.
 */
export default class DesktopAppRunConfig extends EventEmitter {
  _defaultTitle = null;
  _title = null;
  _desktopWindows = [];
  _defaultIconSrc = null;

  constructor(runProps) {
    super();

    const {title, iconSrc, mainWindow} = runProps;

    if (title) {
      this.setTitle(title);
    }

    if (iconSrc) {
      this.setIconSrc(iconSrc);
    }

    if (mainWindow) {
      this.addWindow(mainWindow);
    }

    const linkedState = new DesktopAppRunConfigLinkedState();
    linkedState.addRunConfig(this);
  }

  setTitle(title) {
    if (!this._defaultTitle) {
      this._defaultTitle = title;
    }

    this._title = title;
  }

  getTitle() {
    return this._title;
  }

  getDefaultTitle() {
    return this._defaultTitle;
  }

  setIconSrc(iconSrc) {
    this._defaultIconSrc = iconSrc;
  }

  getIconSrc() {
    return this._defaultIconSrc;
  }

  addWindow(desktopWindow) {
    /*
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be a Window instance');
    }
    */

    this._desktopWindows.push(desktopWindow);
  }

  getWindows() {
    return this._desktopWindows;
  }
}