import React, {Component} from 'react';
// import {PXVideo} from './accessible-html5-video-player/src/PXVideo';
import Window from '../../Window';
import VideoPlayer from 'react-video-js-player';

export default class VideoPlayerWindow extends Component {
  player = {}
  state = {
      video: {
          src: "http://localhost:3001/files?filePath=/home/jeremy/Downloads/Harold and Kumar - Go To White Castle (2004)/Harold.and.Kumar.Go.To.White.Castle.2004.UNRATED.BrRip.x264.YIFY.mp4",
          poster: "http://www.example.com/path/to/video_poster.jpg"
      }
  }

  onPlayerReady(player){
      console.log("Player is ready: ", player);
      this.player = player;
  }

  onVideoPlay(duration){
      console.log("Video played at: ", duration);
  }

  onVideoPause(duration){
      console.log("Video paused at: ", duration);
  }

  onVideoTimeUpdate(duration){
      console.log("Time updated: ", duration);
  }

  onVideoSeeking(duration){
      console.log("Video seeking: ", duration);
  }

  onVideoSeeked(from, to){
      console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd(){
      console.log("Video ended");
  }

  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        title="Video Player"
        onwindowwillclose={ () => this.player.pause() }
      >
      <VideoPlayer
          controls={true}
          src={this.state.video.src}
          poster={this.state.video.poster}
          width="500px"
          height="400px"
          onReady={this.onPlayerReady.bind(this)}
          onPlay={this.onVideoPlay.bind(this)}
          onPause={this.onVideoPause.bind(this)}
          onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
          onSeeking={this.onVideoSeeking.bind(this)}
          onSeeked={this.onVideoSeeked.bind(this)}
          onEnd={this.onVideoEnd.bind(this)}
      />

      </Window>
    );
  }
}