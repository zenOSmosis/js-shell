import { readdir } from '../../utils/socketFS';

describe('readdir', () => {
  test('Directory read', async () => {
    expect.assertions(1);
    
    try {
      const read = await readdir('/tmp');

      expect(Array.isArray(read)).toBe(true);
    } catch (exc) {
      throw exc;
    }
  });
});