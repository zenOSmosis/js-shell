const videoElem = nativeWindow.document.createElement('video');

async function startCapture() {
  const displayMediaOptions = {
    video: {
      cursor: "never"
    },
    audio: false
  };

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch(err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  if (videoElem && videoElem.srcObject) {
    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
  }
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
 
  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

startCapture();

// Handle process shutdown
process.on('beforeExit', () => {
  stopCapture();

  videoElem = null;
});