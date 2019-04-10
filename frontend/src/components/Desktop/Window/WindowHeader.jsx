import React, {Component} from 'react';
import Window from './Window';
import Gesture from '../../Gesture';

export default class WindowHeader extends Component {
  constructor(props) {
    super(props);

    const {desktopWindow} = this.props;
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be instance of Window');
    }
  }

  render() {
    const {desktopWindow, className, toolbar, toolbarRight, subToolbar, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        className={`WindowHeader ${className ? className : ''}`}
      >
        <Gesture
          touch={true}
          mouse={true}
          onMove={(evt) => desktopWindow.moveTo(evt.xy[0], evt.xy[1])}
        >
          <div>
            {
              // TODO: Move styles to CSS declaration
            }
            <div style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }}>
              {
                toolbar
              }
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0 }} className="column left">
              <button
                className="Dot Red"
                onClick={(evt) => desktopWindow.close()}
              ></button>
              <button
                className="Dot Yellow"
                onClick={(evt) => desktopWindow.toggleMinimize()}
              ></button>
              <button
                className="Dot Green"
                onClick={(evt) => desktopWindow.toggleMaximize()}
              ></button>
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0 }} className="column right">
              {
                toolbarRight
              }
            </div>
          </div>

          <div>
            {
              subToolbar
            }
          </div>

        </Gesture>
      </div>
    );
  }
};