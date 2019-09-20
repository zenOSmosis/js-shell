import { dirDetail } from '../../utils/socketFS';

describe('dirDetail', () => {
  test('Discover directory detail', async () => {
    // expect.assertions(1);

    try {
      const tmpDetail = await dirDetail('/tmp');
      expect(tmpDetail.parent).toBe('/');
      expect(tmpDetail.isFile).toBe(false);
      expect(tmpDetail.isDir).toBe(true);
      expect(tmpDetail.constituents.length).toBe(2);

      console.log(tmpDetail);
    } catch (exc) {
      throw exc;
    }
  });
});