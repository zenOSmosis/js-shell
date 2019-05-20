import React, {Component} from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';

export default class HelloWorldWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        app={app}
      >
        <Center>
          Hello World
        </Center>
      </Window>
    );
  }
}