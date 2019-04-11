import React, {Component} from 'react';
import appConfig from './appConfig';
import Window from '../../components/Desktop/Window';
import Center from '../../components/Center';

export default class HelloWorldWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appConfig={appConfig}
      >
        <Center>
          Hello World
        </Center>
      </Window>
    );
  }
}