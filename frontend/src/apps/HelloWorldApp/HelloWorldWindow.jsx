import React, {Component} from 'react';
import appRegistration from './appRegistration';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';

export default class HelloWorldWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appRegistration={appRegistration}
      >
        <Center>
          Hello World
        </Center>
      </Window>
    );
  }
}