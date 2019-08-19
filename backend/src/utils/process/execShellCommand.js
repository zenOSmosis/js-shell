import { exec } from 'child_process';

/**
 * Executes a shell command and return it as a Promise.
 * 
 * @see https://medium.com/@ali.dev/how-to-use-promise-with-exec-in-node-js-a39c4d7bbf77
 * 
 * @param cmd {string}
 * @return {Promise<string>}
 */
const execShellCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

export default execShellCommand;