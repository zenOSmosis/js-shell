import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import IFrame from 'components/IFrame';
// import { Layout, Header, Content } from 'components/Layout';
// import { ButtonGroup, Button } from 'components/ButtonGroup';

const FRONTEND_DOCS_URL = '/docs/frontend/src';

export default class DocsWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
      >
        <IFrame src={FRONTEND_DOCS_URL} />
      </Window>
    );
  }
}