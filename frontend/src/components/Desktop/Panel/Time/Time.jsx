import React, { Component } from 'react';
import moment from 'moment';

const _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class Time extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeString: ''
    };

    this._clockInterval = null;
  }

  componentDidMount() {
    this.startClock();
  }

  componentWillUnmount() {
    this.stopClock();
  }

  startClock() {
    // Prevent duplicate starts
    if (this._clockInterval) {
      console.warn('Clock is already started');
      return;
    }

    // Runs every second
    const _doUpdate = () => {
      this.setState({
        timeString: this.getTime()
      });
    };

    // Start the interval
    this._clockInterval = setInterval(_doUpdate, 1000);

    // Run the initial
    _doUpdate();
  }

  stopClock() {
    clearInterval(this._clockInterval);
  }

  /**
   * TODO: Use moment library for time rendering
   * 
   * @return {string}
   */
  getTime() {
    // @see https://flaviocopes.com/momentjs/
    const timeFormat = `hh:mm:ss A`;
    
    const formattedTime = moment().format(timeFormat);

    const dayIdx = parseInt(moment().format('e'));

    const day = _days[dayIdx];

    return `${day} ${formattedTime}`;
  }

  render() {
    const { timeString } = this.state;

    return (
      <div style={{display: 'inline-block'}}>
          {timeString}
      </div>
    );
  }
}