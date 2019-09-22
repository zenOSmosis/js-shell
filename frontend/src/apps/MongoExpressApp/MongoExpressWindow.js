import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import IFrame from 'components/IFrame';

export default class MongoExpressWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
      >
        <IFrame src="/mongo-express" />
      </Window>
    );
  }
}