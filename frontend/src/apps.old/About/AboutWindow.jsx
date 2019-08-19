import React, {Component} from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
// import Center from 'components/Center';
// import Image from 'components/Image';
import IFrame from 'components/IFrame';
import config from 'config';

export default class AboutWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        app={app}
      >
        <IFrame
          // TODO: Handle onLoad
          onLoad={(component, iframe, evt)=>component.postMessage('hello')}
          
          src={`${config.HOST_REST_URL}/about`}
        />
        {
          /*
          <Center style={{backgroundColor: 'rgba(255,255,255,.8)'}}>
            <Image width="100%" height="100%" src={`${config.HOST_ICON_URL_PREFIX}brands/zenOSmosis-logo.svg`} />
          </Center>
          */
        }
      </Window>
    );
  }
}