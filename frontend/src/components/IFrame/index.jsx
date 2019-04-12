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
  }
  
  render() {
    const {className, ...propsRest} = this.props;

    return (
      <iframe
        ref={ c => this._iframe = c }
        {...propsRest}
        className={`IFrame ${className ? className : ''}`}
      ></iframe>
    );
  }
}