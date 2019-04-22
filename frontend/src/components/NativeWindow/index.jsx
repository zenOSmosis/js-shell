// TODO: Finish building out

import React, {Component} from 'react';

/*
@see https://www.w3schools.com/jsref/met_win_open.asp
specs	Optional. A comma-separated list of items, no whitespaces. The following values are supported:

channelmode=yes|no|1|0	Whether or not to display the window in theater mode. Default is no. IE only
directories=yes|no|1|0	Obsolete. Whether or not to add directory buttons. Default is yes. IE only
fullscreen=yes|no|1|0	Whether or not to display the browser in full-screen mode. Default is no. A window in full-screen mode must also be in theater mode. IE only
height=pixels	The height of the window. Min. value is 100
left=pixels	The left position of the window. Negative values not allowed
location=yes|no|1|0	Whether or not to display the address field. Opera only
menubar=yes|no|1|0	Whether or not to display the menu bar
resizable=yes|no|1|0	Whether or not the window is resizable. IE only
scrollbars=yes|no|1|0	Whether or not to display scroll bars. IE, Firefox & Opera only
status=yes|no|1|0	Whether or not to add a status bar
titlebar=yes|no|1|0	Whether or not to display the title bar. Ignored unless the calling application is an HTML Application or a trusted dialog box
toolbar=yes|no|1|0	Whether or not to display the browser toolbar. IE and Firefox only
top=pixels	The top position of the window. Negative values not allowed
width=pixels	The width of the window. Min. value is 100
*/

/**
 * Opens a host OS window.
 * 
 * Note: Unless this is triggered by hand (or any specific browser settings),
 * this will require permission to be granted in the browser before allowing
 * this to function.
 * 
 * TODO: Finish building out.
 */
export default class NativeWindow extends Component {
  state = {
    title: null,

    isOpen: false
  }

  _nativeWindow = null;

  componentDidMount() {
    this.nativeRender();
  }

  componentDidUpdate() {
    this.nativeRender();
  }

  openNativeWindow() {
    const {isOpenState} = this.state;

    if (isOpenState) {
      console.warn('NativeWindow is already open');
      return;
    }

    const {title} = this.state;
    this._nativeWindow = window.open(null, title, );
  }

  nativeRender() {
    const {isOpen: isOpenProps} = this.props;
    const {isOpen: isOpenState} = this.state;

    if (isOpenProps && !isOpenState) {
      this.openNativeWindow();
    }

    const {children} = this.props;

    // TODO: Render children to native window
  }
  
  render() {
    <div
      style={{display: 'hidden'}}>
    </div>
  }
}