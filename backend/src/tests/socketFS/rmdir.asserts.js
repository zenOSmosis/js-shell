import { readdir } from '../utils/socketFS';

describe('readdir', () => {
  it('Should read a directory', async () => {
    try {
      const read = await readdir('/tmp');

      expect(Array.isArray(read)).toBe(true);
    } catch (exc) {
      throw exc;
    }
  });
});