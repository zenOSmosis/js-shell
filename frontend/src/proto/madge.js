// @see https://www.npmjs.com/package/madge

const madge = require('madge');
 
madge('../index.js')
    .then((res) => res.image('/tmp/image.svg'))
    .then((writtenImagePath) => {
        console.log('Image written to ' + writtenImagePath);
    });
