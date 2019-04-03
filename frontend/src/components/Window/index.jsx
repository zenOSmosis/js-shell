import React, {Component} from 'react';
import Draggable from 'react-draggable';
import ViewTransition from '../ViewTransition';
import $ from 'jquery';
import './style.css';

// TODO: Enable auto-reposition of window if screensize is changed

let zStack = 9999;

export default class Window extends Component {
  state = {
    title: null,
    isActive: false,
    zStack: zStack + 1
  };

  _onDesktopInteract = (evt) => {
    const base = this._base._base;

    if (base === evt.target ||
        $.contains(base, evt.target)) {

        this.setState({
          isActive: true,
          zStack: this.state.zStack + 1
        });
    } else {
      if (this.state.isActive) {
        this.setState({
          isActive: false
        });
      }
    }
  };

  componentDidUpdate() {
    const base = this._base._base;

    console.debug(this.state.zStack);

    $(base).css({
      zIndex: this.state.zStack
    });
  }

  componentDidMount() {
    $(window).on('mousedown', this._onDesktopInteract);
    $(window).on('touchstart', this._onDesktopInteract);
  }

  componentWillUnmount() {
    $(window).off('mousedown', this._onDesktopInteract);
    $(window).off('touchstart', this._onDesktopInteract);
  }

  close() {
    const base = this._base._base;
    base.style.display = 'none';
  }

  setTitle(title) {
    this.setState({
      title
    });
  }

  render() {
    const {children, className, ...propsRest} = this.props;
    const title = this.state.title || this.props.title || '[Untitled Window]';

    // Width & height of 0 on backing div is important for allowing windows to
    // move if two, or more windows, are created on the same coordinates

    return (
      <ViewTransition
        ref={ c => this._base = c }
        className={`${className ? className : ''}`}
        style={{position: 'absolute', width: 0, height: 0}}
        effect={null}
      >
        <Draggable
          scale={1}
        >
          <div
            {...propsRest}
            className={`Window ${this.state.isActive ? 'Active' : ''}`}
          >
            <div className="WindowHeader">
              <div style={{width: '100%', position: 'absolute', fontWeight: 'bold'}}>
                {
                  title
                }
              </div>
              <div style={{position: 'absolute', left: 0}} className="column left">
                <button className="Dot Red"
                  onClick={ (evt) => this.close() }
                ></button>
                <button className="Dot Yellow"></button>
                <button className="Dot Green"></button>
              </div>
            </div>

            <div className="WindowBody">
              {
                children
              }
            </div>
            <div>
              [bottom]
            </div>
          </div>
        </Draggable>
      </ViewTransition>
    );
  }
}