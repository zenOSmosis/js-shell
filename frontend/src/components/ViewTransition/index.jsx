import React, {Component} from 'react';
import EventEmitter from 'events';
// @see https://github.com/daneden/animate.css
import animate from '../../utils/animate';

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

  animate() {
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

          const {effect, onTransitionStart, onTransitionEnd} = this.props;

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
          });
        } catch (exc) {
          throw exc;
        }
      });
    }

    this._lastInView = this.props.inView;
  }

  render() {
    const {children} = this.props;

    return (
      <div ref={ c => this._base = c }
        {...this.props}
      >
        {
          children
        } 
      </div>
    );
  }
}

export default ViewTransition;