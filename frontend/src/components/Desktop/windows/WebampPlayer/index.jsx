import React, {Component} from 'react';
import Webamp from 'webamp'; // eslint-disable-line import/no-unresolved
import Window from '../../Window';

export default class WebampPlayer extends Component {
  componentDidMount() {
    if (!this._webamp) {
      this._webamp = new Webamp({
        initialTracks: [
          {
            metaData: {
              artist: "DJ Mike Llama",
              title: "Llama Whippin' Intro",
            },
            url:
              "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
            duration: 5.322286,
          },
        ],
      });

      console.debug('renderWhenReady', this._webamp.renderWhenReady);
    }

    console.log(this._webamp);

    const container = document.createElement('div');
    document.body.appendChild(container);
    
    this._webamp.renderWhenReady(container);
  }

  render() {
    return (
      <Window>
        <div ref={ c => this._base = c }>

        </div>
      </Window>
    );
  }
}