import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Section from 'components/Section';

export default class HelloWorldWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        title="3D Controller"
      >
        <Section>
          <h1>
            Shape
          </h1>
          3D Box
        </Section>

        <Center>
          Hello World
        </Center>
      </Window>
    );
  }
}