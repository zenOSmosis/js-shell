import React, { Component } from 'react';
import Full from 'components/Full';
import Window from 'components/Desktop/Window';
// import Cover from 'components/Cover';
import ReactPlayer from 'components/ReactPlayer'
// import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';


export default class MediaPlayerWindow extends Component {
  state = {
    // TODO: Remove hardcoded URL
    mediaURL: 'https://www.youtube.com/watch?v=oUFJJNQGwhk'
  };

  render() {
    const { ...propsRest } = this.props;
    const { mediaURL } = this.state;
    const cmdArguments = this.props.app.getCmdArguments();

    // TODO: Remove
    console.debug('cmdArguments', cmdArguments);

    return (
      <Window
        {...propsRest}
      >
        <Full>
          <ReactPlayer
            url={mediaURL}
            playing
          />
        </Full>

        {
          /*
          <Cover>
            <Layout>
              <Footer>
                {cmdArguments}
              </Footer>
            </Layout>
          </Cover>
          */
        }
      </Window>
    );
  }
}