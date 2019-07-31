import React, {Component} from 'react';
// import Editor from '../Editor';
import TabbedPane from './TabbedPane';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';

export default class SplitEditor extends Component {
  state = {
    isSplit: false,
    splitDirection: null
  };

  split(splitDirection) {
    this.setState({
      isSplit: true,
      splitDirection
    })
  }

  render() {
    return (
      <Full>
        {
          // TODO: Don't change DOM structure between states
          // Preserve content in editors when switching states
        }

        {
          !this.state.isSplit &&
          <TabbedPane key="1" splitEditor={this} />
        }
        {
          this.state.isSplit &&
          <SplitterLayout
            // Keep left pane (if vertical) locked when resizing
            primaryIndex={1}
          >
            <TabbedPane key="1" splitEditor={this} />

            <SplitEditor key="2" />
          </SplitterLayout>
        }
      </Full>
    );
  }
}