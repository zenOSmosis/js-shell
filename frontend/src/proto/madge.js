// @see https://www.npmjs.com/package/madge

(async() => {
  try {

    const madge = await import('madge');
    
    madge('../index.js')
        .then((res) => res.image('/tmp/image.svg'))
        .then((writtenImagePath) => {
            console.log('Image written to ' + writtenImagePath);
        });

  } catch (exc) {
    throw exc;
  }
})();