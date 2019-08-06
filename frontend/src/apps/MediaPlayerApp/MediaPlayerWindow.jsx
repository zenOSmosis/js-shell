import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import ReactPlayer from 'react-player'

export default class HelloWorldWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    const cmdArguments = this.props.app.getCmdArguments();
    console.log('cmdArguments',cmdArguments)
    return (
      <Window
        {...propsRest}
      >
        <Center>
          <div>{cmdArguments}</div><br />
          <ReactPlayer url={cmdArguments} playing />
        </Center>
      </Window>
    );
  }
}