import React, { Component } from 'react';
import Window from 'components/Desktop/Window';

export default class TextEditorWindow extends Component {
  state = {
    value: null,
    RichTextEditor: null
  };

  async componentDidMount() {
    // Load editor asynchronously
    // @see https://facebook.github.io/create-react-app/docs/code-splitting
    try {
      const { default: RichTextEditor } = await import('react-rte');
      const value = RichTextEditor.createEmptyValue();

      this.setState({
        value,
        RichTextEditor
      });
    } catch (exc) {
      throw exc;
    }
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
    const { value, RichTextEditor } = this.state;
    
    return (
      <Window
        {...propsRest}
        minWidth={600}
      >
        <div style={{backgroundColor:'#fff', height: '100%', color:'#000'}}>
        {
          RichTextEditor &&
          <RichTextEditor
            style={{height: '100%'}}
            value={value}
            onChange={this.onChange}
          />
        }
        
        </div>
        
      </Window>
    );
  }
}