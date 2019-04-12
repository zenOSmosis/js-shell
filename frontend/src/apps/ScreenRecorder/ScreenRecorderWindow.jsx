import React, {Component} from 'react';
import appConfig from './appConfig';
import Cover from '../../components/Cover';
import Window from '../../components/Desktop/Window';
import IFrame from '../../components/IFrame';
import config from '../../config';
const {HOST_REST_URI} = config;

// TODO: Extract base from config
const appURL =  `${HOST_REST_URI}/desktopApps?filePath=ScreenRecorder/screen-recorder.html`;

export default class ScreenRecorderWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appConfig={appConfig}
      >
        <Cover>
          {
            // TODO: Pass CSS to frame
          }
          <IFrame
            src={appURL}
        ></IFrame>
        </Cover>

        <Cover>
          Cover frame
        </Cover>
      </Window>
    );
  }
}