import { isDir } from '../../utils/socketFS';

describe('isDir', () => {
  test('Check if temp directory exists', async () => {
    expect.assertions(1);

    try {
      const check = await isDir('/tmp');

      expect(check).toBe(true);
    } catch (e) {
      throw e;
    }
  });

  test('Verify a bogus directory does not exist', async () => {
    expect.assertions(1);

    try {
      await isDir('/bajivJ83OAJ892');
    } catch (e) {
      expect(e.message.includes('ENOENT')).toBe(true);
    }
  });
});