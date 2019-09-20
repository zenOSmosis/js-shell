import { mkdir, rm, touch } from '../../utils/socketFS';

describe('mkdir', () => {
  test('Create a directory', async () => {
    expect.assertions(1);

    const TEST_PATH = '/tmp/_b_';

    try {
      await rm(TEST_PATH);

      const ret = await mkdir(TEST_PATH);

      await rm(TEST_PATH);

      expect(ret).toBe();
    } catch (e) {
      throw e;
    }
  });

  test('Should not create directory on an existing file node', async () => {
    expect.assertions(1);

    const TEST_PATH = '/tmp/_a_';

    try {
      await touch(TEST_PATH);

      await mkdir(TEST_PATH);
    } catch (e) {
      expect(e.message).toContain('EEXIST');

      await rm(TEST_PATH);
    }
  });
});