import React, { Component } from 'react';
import ReactNipple from 'react-nipple';
import Cover from '../Cover';
import Center from '../Center';

// optional: include the stylesheet somewhere in your app
// import 'react-nipple/lib/styles.css';

class Joystick extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isMounted: false
    };

    const _elRoot = null;
  }

  componentDidMount() {
    this.setState({
      isMounted: true
    });
  }

  render() {
    const { ...propsRest } = this.props;
    const { isMounted } = this.state;

    return (
      <div
        ref={c => this._elRoot = c}
        style={{position: 'relative', width: '100%', height: '100%', border: '1px #999 dashed'}}
      >
        {
          isMounted &&
          <ReactNipple
              // all events supported by nipplejs are available as callbacks
              // see https://github.com/yoannmoinet/nipplejs#start
              // onMove={(evt, data) => console.log(evt, data)}
              {...propsRest}
          
              // supports all nipplejs options
              // see https://github.com/yoannmoinet/nipplejs#options
              options={{
                zone: this._elRoot,
                mode: 'dynamic',
                position: { top: '50%', left: '50%' }
              }}

              // any unknown props will be passed to the container element, e.g. 'title', 'style' etc
              style={{
                // outline: '1px dashed #999',
                width: '100%',
                height: '100%',
                position: 'relative',
                // if you pass position: 'relative', you don't need to import the stylesheet
              }}
          />
        }
        <Cover>
          <Center>
            <span style={{fontStyle: 'italic'}}>
              Touch here to move Joystick.
            </span>
          </Center>
        </Cover>
      </div>
    );
  }
}

export default Joystick;