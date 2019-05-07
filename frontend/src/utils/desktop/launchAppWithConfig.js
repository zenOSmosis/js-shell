import {desktopLinkedState} from './.common';

const launchAppConfig = (appConfig) => {
  desktopLinkedState.setState({
    lastLaunchAppConfig: appConfig
  });
};

export default launchAppConfig;