import React, {Component} from 'react';
import Window, {EVT_WINDOW_DID_RESIZE} from '../../Window';
// import Center from '../../../Center';
import MonacoEditor from 'react-monaco-editor';

export default class Code extends Component {
  state = {
    bodySize: {}
  };

  resizeLagTimeout = null;

  // TODO: Implement file open
  // TODO: Implement file save

  handleWindowResize = (newSize) => {
    const {bodySize} = newSize;

    // console.debug('BODY SIZE', bodySize);

    if (this.resizeLagTimeout) {
      clearTimeout(this.resizeLagTimeout);
    }

    this.resizeLagTimeout = setTimeout(() => {
      this.setState({
        bodySize
      });
    }, 25);
  };

  render() {
    const {onWindowResize, ...propsRest} = this.props;

    const options = {
      selectOnLineNumbers: true
    };

    return (
      <Window
        ref={ c => this._window = c }
        {...propsRest}
        title="Code"
        onWindowResize={this.handleWindowResize}
      >
        <div style={{textAlign: 'left', width: '100%', height: '100%'}}>
          <MonacoEditor
            ref={ c => this._monacoEditor = c }
            width={this.state.bodySize.width}
            height={this.state.bodySize.height}
            automaticLayout={true}
            language="javascript" // TODO: Implement language detection
            theme="vs-dark"
            value="[ code ]"
            options={options}
            context={this}
            // onChange={this.onChange}
            // editorDidMount={::this.editorDidMount}
          />
        </div>
      </Window>
    );
  }
}