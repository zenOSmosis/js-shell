import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import AppConfig from '../utils/desktop/AppConfig';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'desktop-app-run-configs';

/**
 * A registry of all registered apps for the Desktop.
 */
export default class AppConfigLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      appConfigs: []
    });
  }

  /**
   * Registers a new application to be parsed by the Desktop.
   * @param {AppConfig} appConfig 
   */
  addAppConfig(appConfig) {
    // TODO: Prevent duplicate appConfigs

    if (!(appConfig instanceof AppConfig)) {
      throw new Error('appConfig must be instance of AppConfig');
    }

    const { appConfigs } = this.getState();

    appConfigs.push(appConfig);

    this.setState({
      appConfigs
    });
  }

  getAppConfigs() {
    const { appConfigs } = this.getState();

    return appConfigs;
  }
}