import { pathDetail } from '../../utils/socketFS';

describe('pathDetail', () => {
  test('Discover path detail', async () => {
    expect.assertions(8);

    try {
      const rootDetail = await pathDetail('/');
      expect(rootDetail.parent).toBe(null);
      expect(rootDetail.isFile).toBe(false);
      expect(rootDetail.isDir).toBe(true);
      expect(rootDetail.constituents.length).toBe(1);

      const tmpDetail = await pathDetail('/tmp');
      expect(tmpDetail.parent).toBe('/');
      expect(tmpDetail.isFile).toBe(false);
      expect(tmpDetail.isDir).toBe(true);
      expect(tmpDetail.constituents.length).toBe(2);
    } catch (exc) {
      throw exc;
    }
  });
});