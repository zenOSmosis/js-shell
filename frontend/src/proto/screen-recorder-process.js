// TODO: Debug Uncaught ReferenceError: _ref is not defined

const { ClientWorkerProcess, DependencyFetcherWorker } = this;

/**
 * Fetches text from a single, or set of URIs.
 * 
 * TODO: Move into its own utility
 * 
 * @param {string | string[]} uris
 * @return {Promise<string>}
 */
const fetchScripts = async (uris) => {
  try {
    if (!Array.isArray(uris)) {
      // Convert to an array
      uris = [uris];
    }

    // Perform operation in a worker process
    const workerProcess = new DependencyFetcherWorker();

    workerProcess.stdin.write(
      JSON.stringify(uris)
    );

    const sources = await new Promise((resolve, reject) => {
      // Handle successful data
      workerProcess.stdout.on('data' , (data) => {
        workerProcess.kill();
        resolve(data);
      });

      // Handle data errors
      workerProcess.stderr.on('data', (err) => {
        workerProcess.kill();
        reject(err);
      });
    });

    return sources;
  } catch (exc) {
    throw exc;
  }
};

// Test the implementation
(async () => {
  try {
    // An array of source code
    const sources = await fetchScripts([
      'https://www.webrtc-experiment.com/RecordRTC.js',
      'https://webrtc.github.io/adapter/adapter-latest.js'
    ]);

    console.debug('Captured sources', sources);
  } catch (exc) {
    throw exc;
  }
})();

/*
@see https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/screen-recording.html
<script src="https://www.webrtc-experiment.com/RecordRTC.js"></script>
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
*/