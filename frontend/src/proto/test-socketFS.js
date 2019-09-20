const { socketFS } = this.utils;
const { writeFile, readFile, rm } = socketFS;

(async () => {
  try {
    const TEMP_PATH = '/tmp/__test_write';

    await rm(TEMP_PATH);

    await writeFile(TEMP_PATH, 'Hi there!');

    const buf = await readFile(TEMP_PATH, {
      encoding: 'utf-8'
    });

    // console.debug(String.fromCharCode.apply(null, new Uint16Array(buf)));
    console.debug(buf);

    await rm(TEMP_PATH);

  } catch (exc) {
    throw exc;
  }
})();