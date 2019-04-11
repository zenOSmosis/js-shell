import React, {Component} from 'react';
import EventEmitter from 'events';
// @see https://github.com/daneden/animate.css
import animate from '../../utils/animate';
import './style.css';

/**
 * Performs binary view effect between two views.
 */
class ViewTransition extends Component {
  state = {
    isTransitioning: false
  };

  constructor(props) {
    super(props);

    this._events = new EventEmitter();
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate() {
    this.animate();
  }

  on = (eventName, callback) => {
    return this._events.on(eventName, callback);
  }

  once = (eventName, callback) => {
    return this._events.once(eventName, callback);
  }

  off = (eventName, callback) => {
    return this._events.off(eventName, callback);
  }

  async animate(effect = null) {
    return new Promise((resolve, reject) => {
      try {
        const {effect: propsEffect, onTransitionStart, onTransitionEnd} = this.props;
        effect = effect || propsEffect;
    
        if (!effect) {
          return;
        }
    
        if (this._isInTransition) {
          // console.debug('Ignoring stacked effect');
          return;
        }
    
        if (!this.state.isTransitioning) {
          this.setState({
            isTransitioning: true
          }, async () => {
            try {
              if (this._isInTransition) {
                return;
              }
    
              // console.debug('Transition started');
    
              
    
              this._isInTransition = true;
    
              // Call start hook, if any
              if (typeof onTransitionStart === 'function') {
                onTransitionStart();
              }
              
              await animate(this._base, effect);
    
              // this._cuedOutView = null;
              
              this.setState({
                isTransitioning: false
              }, () => {
                this._isInTransition = false;
    
                this._events.emit('transitionend');
    
                // Call end hook, if any
                if (typeof onTransitionEnd === 'function') {
                  onTransitionEnd();
                }
    
                // console.debug('Transition finished');
                return resolve(true);
              });
            } catch (exc) {
              throw exc;
            }
          });
        }
    
        this._lastInView = this.props.inView;
      } catch (exc) {
        return reject(exc);
      }
    });
  }

  render() {
    const {children, className, effect, onTransitionStart, onTransitionEnd, ...propsRest} = this.props;

    return (
      <div
        ref={ c => this._base = c }
        className={`ViewTransition ${className ? className : ''}`}
        {...propsRest}
      >
        {
          children
        } 
      </div>
    );
  }
}

export default ViewTransition;