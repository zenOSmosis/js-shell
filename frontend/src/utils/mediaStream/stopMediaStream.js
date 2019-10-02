/**
 * Recursively stops all tracks in the given MediaStream.
 * 
 * @param {MediaStream} mediaStream
 */
const stopMediaStream = (mediaStream) => {
  if (!(mediaStream instanceof MediaStream)) {
    console.error('mediaStream is not a MediaStream instance');
    return;
  }

  const tracks = mediaStream.getTracks();
  const lenTracks = tracks.length;
  for (let i = 0; i < lenTracks; i++) {
    tracks[i].stop();
  }
};

export default stopMediaStream;