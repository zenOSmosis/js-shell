import React, {Component} from 'react';
import './style.css';

export default class IFrame extends Component {
  componentDidMount() {
    // TODO: Copy all document.head styles into iframe

    /*
    const styleElements = document.head.getElementsByTagName('style');

    let styleTagString = '';
    for (let i = 0; i < styleElements.length; i++) {
      styleTagString += styleElements[i].outerHTML;
    }

    // console.debug('style tag string', styleTagString);

    this._iframe.addEventListener('load', (evt) => {
      console.debug('frame load', evt, this._iframe);

      // console.debug(this._iframe.contentWindow.document.head);
      this._iframe.contentWindow.postMessage('hello');
    });
    */

    // TODO: Set up binding for listening to messages received from window
  }

  /*
  componentWillUnmount() {
    // TODO: Set up unbinding for listening to messages received from window
  }
  */

  handleOnLoad(evt) {
    const {onLoad} = this.props;
    
    if (typeof onLoad === 'function') {
      const component = this;
      const iFrame = this._iframe;
      
      onLoad(component, iFrame, evt);
    }
  }

  sendMessage(message) {
    try {
      this._iframe.contentWindow.postMessage(message);
    } catch (exc) {
      alert('...');
    }
  }

  /*
  * Alias of this.sendMessage().
  */
  postMessage(...args) {
    return this.sendMessage(...args);
  }

  /*
  handleMessageReceive(message) {

  }
  */
  
  render() {
    const {className, onLoad, ...propsRest} = this.props;

    return (
      <iframe
        ref={ c => this._iframe = c }
        {...propsRest}
        className={`IFrame ${className ? className : ''}`}
        onLoad={(evt) => this.handleOnLoad(evt)}
      ></iframe>
    );
  }
}