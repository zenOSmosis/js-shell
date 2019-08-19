import { mkdir, rm, readdir, getPathSeparator } from '../../utils/socketFS';

describe('rm', () => {
  test('Create a directory and delete it', async () => {
    expect.assertions(4);

    const TEST_DIR = '/tmp';
    const TEST_FILENAME = '_b_';
    const TEST_PATH = `${TEST_DIR}${getPathSeparator()}${TEST_FILENAME}`;

    try {
      // Setup
      await rm(TEST_PATH);

      const tmpFilenames = await readdir(TEST_DIR);

      expect(tmpFilenames.includes(TEST_FILENAME)).toBe(false);

      const mkdirRes = await mkdir(TEST_PATH);
      expect(mkdirRes).toBe();

      const tmpFilenames2 = await readdir(TEST_DIR);
      expect(tmpFilenames2).toContain(TEST_FILENAME);

      const ret = await rm(TEST_PATH);
      expect(ret).toBe();
    } catch (e) {
      throw e;
    }
  });
});