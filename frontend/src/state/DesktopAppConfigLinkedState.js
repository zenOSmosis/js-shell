import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'desktop-app-run-configs';

export default class DesktopAppConfigLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      appConfigs: []
    });
  }

  addAppConfig(appConfig) {
    if (!(appConfig instanceof DesktopAppConfig)) {
      throw new Error('appConfig must be instance of DesktopAppConfig');
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