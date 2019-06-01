import ClientWorkerProcess from 'process/ClientWorkerProcess';

/**
 * Usage:
 * 
 * Write to stdin an array of URIs to fetch.
 * 
 * Read from stdout the fetched texts.
 * 
 * TODO: Support direct fetch streaming?
 */
export default class DependencyFetcherWorker extends ClientWorkerProcess {
  constructor() {
    super(async (proc) => {
      try {
        proc.stdin.on('data', async (data) => {
          console.debug('Received stdin data', data);

          const uris = JSON.parse(data);

          if (!uris) {
            console.error('No URIs to fetch');
            return;
          }

          // Array of plain text Promises
          const fetchPromises = uris.map((uri) => {
            return new Promise(async (resolve, reject) => {
              try {
                // TODO: Acquire resource info; send it to stdout

                // Fetch the result
                const res = await fetch(uri);

                // Convert it to text
                const text = await res.text();

                // Return the plain text
                resolve(text);
              } catch (exc) {
                reject(exc);
              }
            });
          });

          console.debug('Fetching scripts');
          
          // Fetch resources in parallel; if one dependency fails, they all do
          const texts = await Promise.all(fetchPromises);
          
          console.debug('Fetched scripts');

          // Join the texts with a line break
          // TODO: Convert to object
          const text = texts.join('\n');

          proc.stdout.write(text);
        });
      } catch (exc) {
        console.error(exc);

        // Write error to pipe
        proc.stderr.write(exc);
      }
    });
  }
}
