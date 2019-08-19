import { isFile, touch, rm } from '../../utils/socketFS';

describe('isFile', () => {
  test('Create a file, verify it exists, then remove it', async () => {
    expect.assertions(1);

    const TEMP_PATH = '/tmp/_file_write_';

    try {
      await rm(TEMP_PATH);

      await touch(TEMP_PATH);

      const check = await isFile(TEMP_PATH);
      expect(check).toBe(true);

      await rm(TEMP_PATH);
    } catch (e) {
      throw e;
    }
  });
});