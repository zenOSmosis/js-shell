import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import RichTextEditor from 'react-rte';

export default class TextEditorWindow extends Component {

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  };



  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        minWidth={600}
      >
        <div style={{backgroundColor:'#fff', height: '100%', color:'#000'}}>
        <RichTextEditor
          style={{height: '100%'}}
          value={this.state.value}
          onChange={this.onChange}
        />
        </div>
        
      </Window>
    );
  }
}