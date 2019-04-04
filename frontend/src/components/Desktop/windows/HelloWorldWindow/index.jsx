import React, {Component} from 'react';
import Window from '../../Window';
import Center from '../../../Center';

export default class HelloWorldWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        title="Hello World Example Window"
      >
        <Center>
          Hello World
        </Center>
      </Window>
    );
  }
}