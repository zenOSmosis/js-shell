import React, {Component} from 'react';
import Window from '../../Window';
import AppMenu from '../../../AppMenu';

export default class AppMenuWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        title="App Menu"
      >
        <AppMenu />
      </Window>
    );
  }
}