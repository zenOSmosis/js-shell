import React, {Component} from 'react';
import Window from '../../Window';
// import Center from '../../../Center';
import MonacoEditor from 'react-monaco-editor';

export default class Code extends Component {
  // TODO: Implement file open
  // TODO: Implement file save

  render() {
    const {...propsRest} = this.props;

    const options = {
      selectOnLineNumbers: true
    };

    return (
      <Window
        {...propsRest}
        title="Code"
      >
        <div style={{textAlign: 'left', width: '100%', height: '100%'}}>
          <MonacoEditor
            width="100%"
            height="100%"
            language="javascript" // TODO: Implement language detection
            theme="vs-dark"
            value="[ code ]"
            options={options}
            // onChange={this.onChange}
            // editorDidMount={::this.editorDidMount}
          />
        </div>
      </Window>
    );
  }
}