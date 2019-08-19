import { rm, writeFile, readFile } from '../../utils/socketFS';

describe('writeFile', () => {
  test('Write a file, read from it, then delete it', async () => {
    expect.assertions(3);

    const TEST_PATH = '/tmp/_write_file_';

    try {
      // Setup
      await rm(TEST_PATH);

      const retWriteFile = await writeFile(TEST_PATH, 'Hello! Testing 1 2 3');
      expect(retWriteFile).toBe();

      const retReadFile = await readFile(TEST_PATH);
      expect(retReadFile.toString()).toBe('Hello! Testing 1 2 3');

      const retRm = await rm(TEST_PATH);
      expect(retRm).toBe();
    } catch (e) {
      throw e;
    }
  });
});