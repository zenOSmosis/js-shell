import React, {Component} from 'react';
// import Editor from '../Editor';
import EditorTab from './EditorTab';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';

export default class SplitEditor extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isSplit: false,
      splitDirection: null
    };

    this._editorLinkedState = null;
  }

  componentDidMount() {
    const { editorLinkedState } = this.props;
    this._editorLinkedState = editorLinkedState;
    
    this._editorLinkedState.on('update', (updatedState) => {
      console.debug({
        updatedState
      });
    });
  }

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
          <EditorTab key="1" splitEditor={this} />
        }
        {
          /*
          this.state.isSplit &&
          <SplitterLayout
            // Keep left pane (if vertical) locked when resizing
            primaryIndex={1}
          >
            <EditorTab key="1" splitEditor={this} />

            <SplitEditor key="2" />
          </SplitterLayout>
          */
        }
      </Full>
    );
  }
}