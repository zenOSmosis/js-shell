import { touch, mkdir, rm } from '../../utils/socketFS';

describe('touch', () => {
  test('Create a file', async () => {
    expect.assertions(1);

    const TEST_PATH = '/tmp/_touch_test_path_';

    try {

      await rm(TEST_PATH);

      const ret = await touch(TEST_PATH);

      await rm(TEST_PATH);

      expect(ret).toBe();
    } catch (e) {
      throw e;
    }
  });

  it('Should not create file path on an existing directory node', async () => {
    expect.assertions(1);

    const TEST_PATH = '/tmp/_test_dir';

    try {
      // Create prototype directory node
      await rm(TEST_PATH);
      await mkdir(TEST_PATH);

      // This should error
      await touch(TEST_PATH);
    } catch (e) {
      expect(e.message).toContain('EISDIR');

      await rm(TEST_PATH);
    }
  });
});