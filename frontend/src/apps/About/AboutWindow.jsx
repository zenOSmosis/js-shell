import React, {Component} from 'react';
import appConfig from './appConfig';
import Window from '../../components/Desktop/Window';
import Center from '../../components/Center';
import Image from '../../components/Image';
import config from '../../config';

export default class AboutWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appConfig={appConfig}
      >
        <Center style={{backgroundColor: 'rgba(255,255,255,.8)'}}>
          <Image width="100%" height="100%" src={`${config.HOST_ICON_URI_PREFIX}brands/zenOSmosis-logo.svg`} />
        </Center>
      </Window>
    );
  }
}