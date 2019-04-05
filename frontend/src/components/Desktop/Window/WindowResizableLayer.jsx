import React, {Component} from 'react';
import './style.css';

export default class WindowResizableLayer extends Component {
  render() {
    const {children, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        className="WindowResizableLayer"
      >
        <div className="TableRow">
          <div className="TableCell RSControl TopLeft"></div>
          <div className="TableCell RSControl Top"></div>
          <div className="TableCell RSControl TopRight"></div>
        </div>
        <div className="TableRow">
          <div className="TableCell RSControl Left"></div>
          {
            // Note: Main does not get RSControl class
          }
          <div className="TableCell Main">
              {
                children
              }
          </div>
          <div className="TableCell RSControl Right"></div>
        </div>
        <div className="TableRow">
          <div className="TableCell RSControl BottomLeft"></div>
          <div className="TableCell RSControl Bottom"></div>
          <div className="TableCell RSControl BottomRight"></div>
        </div>
      </div>
    )
  }
}