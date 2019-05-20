import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import App from '../utils/desktop/createApp';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'desktop-app-run-configs';

/**
 * A registry of all registered apps for the Desktop.
 */
export default class AppLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      apps: []
    });
  }

  /**
   * Registers a new application to be parsed by the Desktop.
   * @param {App} app 
   */
  addApp(app) {
    // TODO: Prevent duplicate apps

    // TODO: This breaks when using createApp.  Debug why.
    /*
    if (!(app instanceof App)) {
      throw new Error('app must be instance of App');
    }
    */

    const { apps } = this.getState();

    apps.push(app);

    this.setState({
      apps
    });
  }

  getApps() {
    const { apps } = this.getState();

    return apps;
  }
}